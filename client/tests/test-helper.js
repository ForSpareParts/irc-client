/* globals require, mocha */
import Ember from 'ember';
import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

setResolver(resolver);


$(document).ready(function(){
  // Declare `assert`/`expect` as a global here instead of as a var in
  // individual tests. This avoids jshint warnings e.g.: `Redefinition of
  // 'assert'`.
  window.assert = chai.assert;
  window.expect = chai.expect;

  //we use these a lot, so just a couple quick aliases...
  window.equal = window.assert.strictEqual;
  window.notEqual = window.assert.notStrictEqual;

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

});
