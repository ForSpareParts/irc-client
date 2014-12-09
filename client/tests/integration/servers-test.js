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

  });

  afterEach(function(){
    Ember.run(App, 'destroy');
  });

  asyncIt('should add a new server', function() {
    var menuItems = null;
    var serverCountAtStart = null;

    visit('/servers');

    andThen(function() {
      menuItems = find('.nav-items li');
      serverCountAtStart = store.all('server').get('length');

      //there's one menu item for every server, plus one for the 'create' link
      assert.strictEqual(
        menuItems.length,
        serverCountAtStart + 1);
    });

    click('li.new a');
    fillIn('#server-name', 'TestServer');
    fillIn('#host', 'irc.test.net');
    fillIn('#port', '1234');
    click('#save-button');

    andThen(function() {
      menuItems = find('.nav-items li');
      assert.strictEqual(
        menuItems.length,
        serverCountAtStart + 2);

      assert.strictEqual(
        currentRouteName(),
        'servers.index');
    });
  });

  asyncIt('should edit a server and discard', function() {
    var serverRecord = null;
    var serverMenuItem = null;

    visit('/servers');
    click('#server-1 a');

    fillIn('#server-name', 'TestServer');
    
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
      assert.strictEqual(
        currentRouteName(),
        'server');

    });

  });

  asyncIt('should edit a server and save', function() {
    var serverRecord = null;
    var serverMenuItem = null;

    visit('/servers');
    click('#server-1 a');

    fillIn('#server-name', 'TestServer');
    click('button');

    andThen(function() {
      serverRecord = store.getById('server', 1);
      serverMenuItem = find('#server-1');

      //the record was successfully changed
      assert.strictEqual(
        serverRecord.get('name'),
        'TestServer');

      //the changes were saved, so we should be able to find the new title
      assert.notEqual(serverMenuItem.html().indexOf('TestServer'), -1);
      assert.strictEqual(
        currentRouteName(),
        'servers.index');

    });

  });


});