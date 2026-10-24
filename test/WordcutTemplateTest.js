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
});
