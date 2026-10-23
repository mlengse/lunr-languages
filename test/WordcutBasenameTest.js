var assert = require('assert');
var test = require('node:test');

test('wordcut path.basename extension check on posix vs win32', async function(t) {
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  var splitPath = function(filename) {
    return splitPathRe.exec(filename).slice(1);
  };

  var wordcutBasename = function(path, ext) {
    var f = splitPath(path)[2];
    if (ext) {
      if (process.platform === 'win32') {
        if (f.substr(-1 * ext.length).toLowerCase() === ext.toLowerCase()) {
          f = f.substr(0, f.length - ext.length);
        }
      } else {
        if (f.substr(-1 * ext.length) === ext) {
          f = f.substr(0, f.length - ext.length);
        }
      }
    }
    return f;
  };

  var originalPlatform = process.platform;

  await t.test('case-sensitive extension check on posix (linux)', function() {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
      configurable: true
    });

    assert.strictEqual(wordcutBasename('file.TXT', '.txt'), 'file.TXT');
    assert.strictEqual(wordcutBasename('file.txt', '.txt'), 'file');
    assert.strictEqual(wordcutBasename('file.TXT', '.TXT'), 'file');
  });

  await t.test('case-insensitive extension check on win32', function() {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      configurable: true
    });

    assert.strictEqual(wordcutBasename('file.TXT', '.txt'), 'file');
    assert.strictEqual(wordcutBasename('file.txt', '.TXT'), 'file');
    assert.strictEqual(wordcutBasename('file.Txt', '.tXt'), 'file');
    assert.strictEqual(wordcutBasename('file.txt', '.txt'), 'file');
  });

  Object.defineProperty(process, 'platform', {
    value: originalPlatform,
    configurable: true
  });
});
