import Ember from 'ember';
import startApp from '../helpers/start-app';
import { describeModule, it } from 'ember-mocha';
/* global assert, asyncIt */

var App;
var store;

describeModule('route:servers', 'Servers', {}, function() {
  beforeEach(function(){
    App = startApp();
    store = App.__container__.lookup('store:main');

    visit('/');
    click('#servers-modal-trigger');
  });

  afterEach(function(){
    Ember.run(App, 'destroy');
  });

  asyncIt('should add a new server', function() {
    var menuItems = null;
    var serverCountAtStart = null;

    andThen(function() {
      menuItems = find('.server-menu li');
      serverCountAtStart = store.all('server').get('length');

      //there's one menu item for every server, plus one for the 'create' link
      assert.strictEqual(
        menuItems.length,
        serverCountAtStart);
    });

    click('.server-menu a.create');

    fillInFocus('#server-name', 'TestServer');
    fillInFocus('#host', 'irc.test.net');
    fillInFocus('#port', '1234');
    click('#save-button');

    andThen(function() {
      menuItems = find('.server-menu li');
      assert.strictEqual(
        menuItems.length,
        serverCountAtStart + 1);
    });
  });

  asyncIt('should edit a server and discard', function() {
    var serverRecord = null;
    var serverMenuItem = null;

    click('#server-1 a');
    fillInFocus('#server-name', 'TestServer');
    
    //leaving without clicking save should discard the changes
    click('#server-2 a');

    andThen(function() {
      serverRecord = store.getById('server', 1);
      serverMenuItem = find('#server-1');

      //the record hasn't changed
      assert.strictEqual(
        serverRecord.get('name'),
        'FooServer');

      //the changes weren't saved, so 'TestServer' shouldn't be in the HTML
      assert.strictEqual(serverMenuItem.html().indexOf('TestServer'), -1);
    });

  });

  asyncIt('should edit a server and save', function() {
    var serverRecord = null;
    var serverMenuItem = null;

    click('#server-1 a');
    fillInFocus('#server-name', 'TestServer');
    click('#save-button');

    andThen(function() {
      serverRecord = store.getById('server', 1);
      serverMenuItem = find('#server-1');

      //the record was successfully changed
      assert.strictEqual(
        serverRecord.get('name'),
        'TestServer');

      //the changes were saved, so we should be able to find the new title
      assert.notEqual(serverMenuItem.html().indexOf('TestServer'), -1);

    });
  });

  asyncIt('should refuse to save a server that doesn\'t validate', function() {
    click('.server-menu a.create');
    click('#save-button');

    andThen(function() {
      assert.ok(find('.save-failed').text().indexOf('could not save') > -1);
    });
  });


});