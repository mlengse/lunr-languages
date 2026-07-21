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

function wordCharacters(script) {
    var charRegex = require('unicode-8.0.0/scripts/' + script + '/regex');
    var regexString = charRegex.toString();
    if (regexString.slice(0, 2) !== '/[' || regexString.slice(-2) != ']/') {
        console.error('Unexpected regex structure, aborting: ' + regexString);
        throw Error;
    }
    return regexString.slice(2, -2);
}

var list = [
    { locale: 'ar' },
    { locale: 'hi' },
    { locale: 'da', file: 'DanishStemmer.js', stopwords: stopwordsRepoFolder + 'da.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'nl', file: 'DutchStemmer.js', stopwords: stopwordsRepoFolder + 'nl.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'du', file: 'DutchStemmer.js', stopwords: stopwordsRepoFolder + 'nl.csv', wordCharacters: wordCharacters('Latin'), warningMessage: '[Lunr Languages] Please use the "nl" instead of the "du". The "nl" code is the standard code for Dutch language, and "du" will be removed in the next major versions.' },
    { locale: 'fi', file: 'FinnishStemmer.js', stopwords: stopwordsRepoFolder + 'fn.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'fr', file: 'FrenchStemmer.js', stopwords: stopwordsRepoFolder + 'fr.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'de', file: 'GermanStemmer.js', stopwords: stopwordsRepoFolder + 'de.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'hu', file: 'HungarianStemmer.js', stopwords: stopwordsRepoFolder + 'hu.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'it', file: 'ItalianStemmer.js', stopwords: stopwordsRepoFolder + 'it.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'id', file: 'IndonesianStemmer.js', stopwords: stopwordsRepoFolder + 'id.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'jp' },
    { locale: 'kn' },
    { locale: 'th' },
    { locale: 'sa' },
    { locale: 'ta' },
    { locale: 'te' },
    { locale: 'zh' },
    { locale: 'ko' },
    { locale: 'hy' },
    { locale: 'he' },
    { locale: 'el' },
    { locale: 'no', file: 'NorwegianStemmer.js', stopwords: stopwordsCustomFolder + 'no.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'pt', file: 'PortugueseStemmer.js', stopwords: stopwordsRepoFolder + 'pt.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'ro', file: 'RomanianStemmer.js', stopwords: stopwordsCustomFolder + 'ro.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'ru', file: 'RussianStemmer.js', stopwords: stopwordsCustomFolder + 'ru.csv', wordCharacters: wordCharacters('Cyrillic') },
    { locale: 'es', file: 'SpanishStemmer.js', stopwords: stopwordsRepoFolder + 'es.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'sv', file: 'SwedishStemmer.js', stopwords: stopwordsCustomFolder + 'sv.csv', wordCharacters: wordCharacters('Latin') },
    { locale: 'tr', file: 'TurkishStemmer.js', stopwords: stopwordsCustomFolder + 'tr.csv', wordCharacters: wordCharacters('Latin') },
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
            var data = fs.readFileSync('build/snowball-js/stemmer/src/ext/' + fd.file, 'utf8');
            var stopWords = fs.readFileSync('build/' + fd.stopwords, 'utf8');
            f = tpl;
            f = cm + f;
            f = f.replace(/\{\{locale\}\}/g, fd.locale);
            f = f.replace(/\{\{stemmerFunction\}\}/g, data.substring(data.indexOf('function')));
            f = f.replace(/\{\{stopWords\}\}/g, stopWords.split(',').sort().join(' '));
            f = f.replace(/\{\{stopWordsLength\}\}/g, stopWords.split(',').length + 1);
            f = f.replace(/\{\{languageName\}\}/g, fd.file.replace(/Stemmer\.js/g, ''));
            f = f.replace(/\{\{wordCharacters\}\}/g, fd.wordCharacters);
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
