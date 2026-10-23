var test = require('node:test');
var describe = test.describe;
var it = test.it;
var assert = require('assert');

var lunr = {};
require('../lunr.stemmer.support.js')(lunr);

describe('Stemmer support Among initialisation', function() {
  it('should successfully initialize Among with valid parameters', function() {
    var among = new lunr.stemmerSupport.Among('test', 1, 2);
    assert.equal(among.s_size, 4);
    assert.deepEqual(among.s, [116, 101, 115, 116]);
    assert.equal(among.substring_i, 1);
    assert.equal(among.result, 2);
  });

  it('should successfully initialize Among with empty string s and substring_i as 0', function() {
    var among = new lunr.stemmerSupport.Among('', 0, 1);
    assert.equal(among.s_size, 0);
    assert.deepEqual(among.s, []);
    assert.equal(among.substring_i, 0);
    assert.equal(among.result, 1);
  });

  it('should throw error on invalid s parameter', function() {
    assert.throws(function() {
      new lunr.stemmerSupport.Among(null, 0, 1);
    }, function(err) {
      return typeof err === 'string' && err.indexOf('Bad Among initialisation') === 0;
    });

    assert.throws(function() {
      new lunr.stemmerSupport.Among(undefined, 0, 1);
    }, function(err) {
      return typeof err === 'string' && err.indexOf('Bad Among initialisation') === 0;
    });
  });

  it('should throw error on invalid substring_i parameter', function() {
    assert.throws(function() {
      new lunr.stemmerSupport.Among('test', null, 1);
    }, function(err) {
      return typeof err === 'string' && err.indexOf('Bad Among initialisation') === 0;
    });

    assert.throws(function() {
      new lunr.stemmerSupport.Among('test', undefined, 1);
    }, function(err) {
      return typeof err === 'string' && err.indexOf('Bad Among initialisation') === 0;
    });
  });

  it('should throw error on invalid result parameter', function() {
    assert.throws(function() {
      new lunr.stemmerSupport.Among('test', 0, null);
    }, function(err) {
      return typeof err === 'string' && err.indexOf('Bad Among initialisation') === 0;
    });

    assert.throws(function() {
      new lunr.stemmerSupport.Among('test', 0, undefined);
    }, function(err) {
      return typeof err === 'string' && err.indexOf('Bad Among initialisation') === 0;
    });

    assert.throws(function() {
      new lunr.stemmerSupport.Among('test', 0, 0);
    }, function(err) {
      return typeof err === 'string' && err.indexOf('Bad Among initialisation') === 0;
    });

    assert.throws(function() {
      new lunr.stemmerSupport.Among('test', 0, false);
    }, function(err) {
      return typeof err === 'string' && err.indexOf('Bad Among initialisation') === 0;
    });
  });
});
