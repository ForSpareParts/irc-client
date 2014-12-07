/* globals require, mocha */
import resolver from './helpers/resolver';
import { setResolver } from 'ember-mocha';

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

  // Declare `assert` as a global here instead of as a var in individual tests.
  // This avoids jshint warnings re: `Redefinition of 'assert'`.
  window.assert = chai.assert;

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
