/* globals require, mocha */
import Ember from 'ember';
import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

/**
 * A wrapper for it() that starts the Ember run loop so we can test promises.
 */
window.asyncIt = function(message, callback) {
  return window.it(message, function() {
    Ember.run(function() {
      callback();
    });
  });
};

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

/**
 * A wrapper for fillIn() to focus the target element before filling it in.
 */
Ember.Test.registerAsyncHelper('fillInFocus',
  function(app, selector, text, context) {
    triggerEvent(selector, 'focus');
    fillIn(selector, text);
  }
);

setResolver(resolver);

document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

//make an empty post to url. used for calling test reset functions
var makePost = function(url, callback) {
  var xhr = new window.XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          callback();
      }
  };
  xhr.send(JSON.stringify({}));
};

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
    makePost('/dev/test/setup', done);
  });

  afterEach(function(done) {
    makePost('/dev/test/reset', done);
  });

  after(function(done) {
    makePost('/dev/test/teardown', done);
  });

  mocha.run();
});
