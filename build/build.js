/**
 * execute like this (from the project root folder):
 * node build/build.js
 */

var fs = require('fs');
var beautify = require('js-beautify').js_beautify;
var Terser = require('terser');

function compress(orig_code) {
    return Terser.minify(orig_code, { compress: false, mangle: false, output: { beautify: false }, comments: true }).then(function(r) { return r.code; });
}

var stopwordsRepoFolder = './stopwords-filter/lib/stopwords/snowball/locales/';
var stopwordsCustomFolder = './stopwords-custom/';
var stemmersCustomFolder = './custom-stemmers/';

function wordCharacters(script) {
    var charRegex = require('unicode-8.0.0/scripts/' + script + '/regex');
    var regexString = charRegex.toString();
    if (regexString.slice(0, 2) !== '/[' || regexString.slice(-2) != ']/') {
        console.error('Unexpected regex structure, aborting: ' + regexString);
        throw Error;
    }
    return regexString.slice(2, -2);
}

function accentFoldFunction(locale) {
    return [
        '',
        '        lunr.' + locale + '.accentFold = function(token) {',
        '            if (!token || typeof token.clone !== "function") {',
        '                return token;',
        '            }',
        '',
        '            var str = token.toString();',
        '            var folded = str',
        '                .replace(/[\\u00E1\\u00E0\\u00E4\\u00E2]/g, "a")',
        '                .replace(/[\\u00E9\\u00E8\\u00EB\\u00EA]/g, "e")',
        '                .replace(/[\\u00ED\\u00EC\\u00EF\\u00EE]/g, "i")',
        '                .replace(/[\\u00F3\\u00F2\\u00F6\\u00F4]/g, "o")',
        '                .replace(/[\\u00FA\\u00F9\\u00FC\\u00FB]/g, "u");',
        '',
        '            if (folded === str) {',
        '                return token;',
        '            }',
        '',
        '            return [token, token.clone(function() {',
        '                return folded;',
        '            })];',
        '        };',
        '',
        '        lunr.Pipeline.registerFunction(lunr.' + locale + '.accentFold, "accentFold-' + locale + '");'
    ].join('\n');
}

function accentFoldTermFunction(locale) {
    return [
        '',
        '        lunr.' + locale + '.accentFoldTerm = function(term) {',
        '            return term',
        '                .replace(/[\\u00E0\\u00E1\\u00E2\\u00E4\\u00C0\\u00C1\\u00C2\\u00C4]/g, "a")',
        '                .replace(/[\\u00E7\\u00C7]/g, "c")',
        '                .replace(/[\\u00E9\\u00E8\\u00EA\\u00EB\\u00C9\\u00C8\\u00CA\\u00CB]/g, "e")',
        '                .replace(/[\\u00EE\\u00EF\\u00CE\\u00CF]/g, "i")',
        '                .replace(/[\\u00F4\\u00F6\\u00D4\\u00D6]/g, "o")',
        '                .replace(/[\\u00F9\\u00FB\\u00FC\\u00D9\\u00DB\\u00DC]/g, "u")',
        '                .replace(/[\\u0178\\u00FF]/g, "y")',
        '                .replace(/[\\u00E6\\u00C6]/g, "ae")',
        '                .replace(/[\\u0153\\u0152]/g, "oe");',
        '        };'
    ].join('\n');
}

function accentFoldTokenFunction(locale) {
    return accentFoldTermFunction(locale) + [
        '',
        '        lunr.' + locale + '.accentFold = function(token) {',
        '            if (!token) {',
        '                return token;',
        '            }',
        '',
        '            if (typeof token.update === "function") {',
        '                return token.update(function(term) {',
        '                    return lunr.' + locale + '.accentFoldTerm(term);',
        '                });',
        '            }',
        '',
        '            if (typeof token === "string") {',
        '                return lunr.' + locale + '.accentFoldTerm(token);',
        '            }',
        '',
        '            return token;',
        '        };',
        '',
        '        lunr.Pipeline.registerFunction(lunr.' + locale + '.accentFold, "accentFold-' + locale + '");'
    ].join('\n');
}

function accentFoldWildcardNormalizerFunction(locale) {
    return [
        '',
        '        lunr.' + locale + '.wildcardNormalizer = function(term) {',
        '            return lunr.' + locale + '.accentFoldTerm(term);',
        '        };',
        '',
        '        lunr.' + locale + '.wildcardNormalizer.label = "wildcardNormalizer-' + locale + '";',
        '        lunr.' + locale + '.wildcardNormalizer.pipelineFunctionLabel = "stemmer-' + locale + '";',
        '        lunr.stemmerSupport.addQueryParserWildcardNormalizer(lunr, lunr.' + locale + '.wildcardNormalizer);'
    ].join('\n');
}

function germanWildcardNormalizerFunction(locale) {
    return [
        '',
        '        lunr.' + locale + '.wildcardNormalizer = function(term) {',
        '            return term',
        '                .replace(/[\\u00DF\\u1E9E]/g, "ss")',
        '                .replace(/[\\u00E4\\u00C4]/g, "a")',
        '                .replace(/[\\u00F6\\u00D6]/g, "o")',
        '                .replace(/[\\u00FC\\u00DC]/g, "u");',
        '        };',
        '',
        '        lunr.' + locale + '.wildcardNormalizer.label = "wildcardNormalizer-' + locale + '";',
        '        lunr.' + locale + '.wildcardNormalizer.pipelineFunctionLabel = "stemmer-' + locale + '";',
        '        lunr.stemmerSupport.addQueryParserWildcardNormalizer(lunr, lunr.' + locale + '.wildcardNormalizer);'
    ].join('\n');
}

// list mapping between locale, stemmer file, stopwords file, and char pattern
var list = [
    {
        locale: 'ar',
    }, {
        locale: 'hi'
    }, {
        locale: 'da',
        file: 'DanishStemmer.js',
        stopwords: stopwordsRepoFolder + 'da.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'nl',
        file: 'DutchStemmer.js',
        stopwords: stopwordsRepoFolder + 'nl.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        /*
        Kept here to prevent breaking changes.
        The correct code for Dutch is NL.
        Please do not use "du" anymore, start using "nl".
        I will remove "du" next time I'll build a major, backward incompatible package
        */
        locale: 'du',
        file: 'DutchStemmer.js',
        stopwords: stopwordsRepoFolder + 'nl.csv',
        wordCharacters: wordCharacters('Latin'),
        warningMessage: '[Lunr Languages] Please use the "nl" instead of the "du". The "nl" code is the standard code for Dutch language, and "du" will be removed in the next major versions.'
    }, {
        locale: 'fi',
        file: 'FinnishStemmer.js',
        stopwords: stopwordsRepoFolder + 'fn.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'fr',
        file: 'FrenchStemmer.js',
        stopwords: stopwordsRepoFolder + 'fr.csv',
        wordCharacters: wordCharacters('Latin'),
        defaultAccentFolding: true,
        wildcardNormalizer: accentFoldWildcardNormalizerFunction
    }, {
        locale: 'de',
        file: 'GermanStemmer.js',
        stopwords: stopwordsRepoFolder + 'de.csv',
        wordCharacters: wordCharacters('Latin'),
        wildcardNormalizer: germanWildcardNormalizerFunction
    }, {
        locale: 'hu',
        file: 'HungarianStemmer.js',
        stopwords: stopwordsRepoFolder + 'hu.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'it',
        file: 'ItalianStemmer.js',
        stopwords: stopwordsRepoFolder + 'it.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'ja'
    }, {
        locale: 'jp'
    }, {
        locale: 'kn'
    }, {
        locale: 'no',
        file: 'NorwegianStemmer.js',
        stopwords: stopwordsCustomFolder + 'no.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'pt',
        file: 'PortugueseStemmer.js',
        stopwords: stopwordsRepoFolder + 'pt.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'pl',
        file: 'PolishStemmer.js',
        stemmer: stemmersCustomFolder + 'PolishStemmer.js',
        stopwords: stopwordsCustomFolder + 'pl.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'ro',
        file: 'RomanianStemmer.js',
        stopwords: stopwordsCustomFolder + 'ro.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'ru',
        file: 'RussianStemmer.js',
        stopwords: stopwordsCustomFolder + 'ru.csv',
        wordCharacters: wordCharacters('Cyrillic')
    }, {
        locale: 'es',
        file: 'SpanishStemmer.js',
        stopwords: stopwordsRepoFolder + 'es.csv',
        wordCharacters: wordCharacters('Latin'),
        accentFolding: true
    }, {
        locale: 'sa'
    }, {
        locale: 'sv',
        file: 'SwedishStemmer.js',
        stopwords: stopwordsCustomFolder + 'sv.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'ta',
    }, {
        locale: 'te'
    }, {
        locale: 'tr',
        file: 'TurkishStemmer.js',
        stopwords: stopwordsCustomFolder + 'tr.csv',
        wordCharacters: wordCharacters('Latin')
    }, {
        locale: 'th',
    }, {
        locale: 'vi',
    }, {
        locale: 'zh',
    }, {
        locale: 'ko',
    }, {
        locale: 'hy',
    }, {
        locale: 'he',
    }, {
        locale: 'el',
    }
];

async function main() {
    console.log('Starting building lunr-languages ...');
    var tpl = fs.readFileSync('build/lunr.template', 'utf8');
    var cm = fs.readFileSync('build/lunr.comments', 'utf8');

    for (var i = 0; i < list.length; i++) {
        console.log('Building for "' + list[i].locale + '"');
        var f;
        var fd = list[i];
        var ft = fd.file && fd.stopwords;

        if (ft) {
            var data = fs.readFileSync('build/' + (fd.stemmer || ('snowball-js/stemmer/src/ext/' + fd.file)), 'utf8');
            var stopWords = fs.readFileSync('build/' + fd.stopwords, 'utf8');
            var languageExtras = [];

            if (fd.accentFolding) {
                languageExtras.push(accentFoldFunction(fd.locale));
            }

            if (fd.defaultAccentFolding) {
                languageExtras.push(accentFoldTokenFunction(fd.locale));
            }

            if (fd.wildcardNormalizer) {
                languageExtras.push(fd.wildcardNormalizer(fd.locale));
            }

            f = tpl;
            f = cm + f;
            f = f.replace(/\{\{locale\}\}/g, fd.locale);
            f = f.replace(/\{\{stemmerFunction\}\}/g, data.substring(data.indexOf('function')));
            f = f.replace(/\{\{stopWords\}\}/g, stopWords.split(',').sort().join(' '));
            f = f.replace(/\{\{stopWordsLength\}\}/g, stopWords.split(',').length + 1);
            f = f.replace(/\{\{languageName\}\}/g, fd.file.replace(/Stemmer\.js/g, ''));
            f = f.replace(/\{\{wordCharacters\}\}/g, fd.wordCharacters);
            f = f.replace(/\{\{pipelineBeforeStemmer\}\}/g, fd.defaultAccentFolding ? '\n                lunr.' + fd.locale + '.accentFold,' : '');
            f = f.replace(/\{\{languageExtras\}\}/g, languageExtras.join('\n'));
            f = f.replace(/\{\{consoleWarning\}\}/g, fd.warningMessage ? '\n\nconsole.warn(' + JSON.stringify(fd.warningMessage) + ');' : '');
        } else {
            f = fs.readFileSync('lunr.' + fd.locale + '.js', 'utf8');
        }

        fs.writeFileSync('lunr.' + fd.locale + '.js', beautify(f, { indent_size: 2 }));
        var min = ft ? cm.replace(/\{\{languageName\}\}/g, fd.file.replace(/Stemmer\.js/g, '')) + await compress(f) : await compress(f);
        fs.writeFileSync('min/lunr.' + fd.locale + '.min.js', min);
    }

    console.log('Building Stemmer Support');
    var support = fs.readFileSync('lunr.stemmer.support.js', 'utf8');
    fs.writeFileSync('min/lunr.stemmer.support.min.js', await compress(support));

    console.log('Building Multi-Language Extension');
    var multi = fs.readFileSync('lunr.multi.js', 'utf8');
    fs.writeFileSync('min/lunr.multi.min.js', await compress(multi));

    console.log('Done!');
}

main().catch(function(err) { console.error(err.message, err.stack); });
