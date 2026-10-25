var test = require('node:test');
var describe = test.describe;
var it = test.it;
var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

var zhSource = fs.readFileSync(__dirname + '/../lunr.zh.js', 'utf8');

function createLunr() {
  function Token(token, metadata) {
    this.token = token;
    this.metadata = metadata || {};
  }
  Token.prototype.toString = function() { return this.token; };
  return {
    version: '2.3.5',
    stemmerSupport: {},
    Token: Token,
    trimmerSupport: { generateTrimmer: function() { return function(t) { return t; }; } },
    Pipeline: { registerFunction: function() {} },
    generateStopWordFilter: function() { return function(t) { return t; }; }
  };
}

function loadAsNode(requireFn) {
  var sandbox = {
    module: { exports: {} },
    exports: {},
    require: requireFn,
    console: { info: function() {}, error: function() {} }
  };
  sandbox.globalThis = sandbox;
  vm.runInNewContext(zhSource, sandbox);
  return sandbox.module.exports;
}

var mockJieba = {
  cut: function(str, searchMode) {
    return str.split('，').map(function(s) {
      return s.split('').join(' ');
    });
  }
};

describe('Chinese Tokenizer Benchmark', function() {
  it('benchmarks jieba tokenizer speed', function() {
    var plugin = loadAsNode(function(name) {
      if (name === '@node-rs/jieba') return mockJieba;
      throw new Error('Not found');
    });
    var lunr = createLunr();
    plugin(lunr);

    var sample = '中华人民共和 国 central country, 这是一个测试文本，用于测试lunr中文分词器的性能。分词器需要处理重复词语，比如测试、文本、性能、分词器。'.repeat(50);

    // Warm up
    for (var i = 0; i < 50; i++) {
      lunr.zh.tokenizer(sample);
    }

    var start = Date.now();
    var iterations = 500;
    for (var j = 0; j < iterations; j++) {
      lunr.zh.tokenizer(sample);
    }
    var elapsed = Date.now() - start;

    console.log('Benchmark elapsed time for ' + iterations + ' iterations: ' + elapsed + ' ms');
    assert.ok(elapsed >= 0);
  });
});
