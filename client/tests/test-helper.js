/* globals require, mocha */
import Ember from 'ember';
import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

/**
 * the MDN polyfill for Function.prototype.bind, which is not supported in
 * PhantomJS 1.9.7
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        FNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof FNOP && oThis ? this : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();

    return fBound;
  };
}

setResolver(resolver);

document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

$(document).ready(function(){
  // Rename elements from qunit -> mocha
  $('#qunit').attr('id', 'mocha');
  $('#qunit-fixture').attr('id', 'mocha-fixture');

  // Declare `assert`/`expect` as a global here instead of as a var in
  // individual tests. This avoids jshint warnings e.g.: `Redefinition of
  // 'assert'`.
  window.assert = chai.assert;
  window.expect = chai.expect;

  require('ember-cli/test-loader')['default'].load();

  before(function(done) {
    $.post('/dev/test/setup', '',
      function() {
        done();
      });
  });

  afterEach(function(done) {
    $.post('/dev/test/reset', '',
      function() {
        done();
      });
  });

  after(function(done) {
    $.post('/dev/test/teardown', '',
      function() {
        done();
      });
  });

  mocha.run();
});
