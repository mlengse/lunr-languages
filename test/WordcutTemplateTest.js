var test = require('node:test');
var describe = test.describe;
var it = test.it;
var assert = require('assert');
var fs = require('fs');
var path = require('path');

describe("Wordcut security and functionality test", function () {
    it("should not contain new Function in wordcut.js", function () {
        var wordcutCode = fs.readFileSync(path.join(__dirname, '../wordcut.js'), 'utf8');
        assert.strictEqual(wordcutCode.includes('new Function'), false, "wordcut.js should not contain 'new Function'");
    });

    it("should perform Thai word segmentation correctly using wordcut", function () {
        var wordcut = require('../wordcut');
        wordcut.init();
        var result = wordcut.cut('สวัสดีชาวโลก');
        assert.strictEqual(result, 'สวัสดี|ชาว|โลก');
    });

    it("should match globstar patterns using start indices in matchOne", function () {
        var wordcutCode = fs.readFileSync(path.join(__dirname, '../wordcut.js'), 'utf8');

        var matchOneIdx = wordcutCode.indexOf('Minimatch.prototype.matchOne = function');
        var matchOneEndIdx = wordcutCode.indexOf('// replace stuff like', matchOneIdx);

        var getMatchOne = new Function('GLOBSTAR', 'Minimatch', wordcutCode.substring(matchOneIdx, matchOneEndIdx) + '; return Minimatch.prototype.matchOne;');

        var GLOBSTAR = {};
        var Minimatch = function () {};
        var matchOne = getMatchOne(GLOBSTAR, Minimatch);
        Minimatch.prototype.matchOne = matchOne;

        var context = new Minimatch();
        context.options = {};
        context.debug = function () {};

        // File segments: ['a', 'b', 'c', 'd']
        // Pattern segments: ['a', GLOBSTAR, 'd']
        var file = ['a', 'b', 'c', 'd'];
        var pattern = ['a', GLOBSTAR, 'd'];

        var result = matchOne.call(context, file, pattern, false);
        assert.strictEqual(result, true, "matchOne should match ['a', 'b', 'c', 'd'] with ['a', GLOBSTAR, 'd']");

        // Non-matching case
        var patternMismatch = ['a', GLOBSTAR, 'e'];
        var resultMismatch = matchOne.call(context, file, patternMismatch, false);
        assert.strictEqual(resultMismatch, false, "matchOne should not match ['a', 'b', 'c', 'd'] with ['a', GLOBSTAR, 'e']");

        // Test explicit start indices fi and pi
        var resultSub = matchOne.call(context, file, pattern, false, 1, 1);
        // file starting at index 1: ['b', 'c', 'd']
        // pattern starting at index 1: [GLOBSTAR, 'd']
        assert.strictEqual(resultSub, true, "matchOne with fi=1, pi=1 should match remaining file and pattern");
    });
});
