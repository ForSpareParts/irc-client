/* globals require, mocha */
import Ember from 'ember';
import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

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
