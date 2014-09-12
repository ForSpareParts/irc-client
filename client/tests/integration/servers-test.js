import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;
var store;

module('Servers', {
  setup: function(){
    App = startApp();
    store = App.__container__.lookup('store:main');

  },
  teardown: function(){
    Ember.run(App, 'destroy');
  }
});

test('add new server', function() {
  visit('/servers');

  andThen(function() {
    var menuItems = find('.nav-items li');
    var serverCountAtStart = store.all('server').get('length');

    //there's one menu item for every server, plus one for the 'create' link
    equal(
      menuItems.length,
      serverCountAtStart + 1);

    click('li.new a');
    fillIn('#server-name', 'TestServer');
    fillIn('#host', 'irc.test.net');
    fillIn('#port', '1234');
    click('button');

    andThen(function() {
      menuItems = find('.nav-items li');
      equal(
        menuItems.length,
        serverCountAtStart + 2);

      equal(
        currentRouteName(),
        'servers.index');
    });


  });
});

test('edit server and discard', function() {
  visit('/servers');
  click('#server-1 a');

  fillIn('#server-name', 'TestServer');
  
  //leaving without clicking save should discard the changes
  click('#server-2 a');

  andThen(function() {
    var serverRecord = store.getById('server', 1);
    var serverMenuItem = find('#server-1');

    //the record hasn't changed
    equal(
      serverRecord.get('name'),
      'FooServer');

    //the changes weren't saved, so 'TestServer' shouldn't be in the HTML
    equal(serverMenuItem.html().indexOf('TestServer'), -1);
    equal(
      currentRouteName(),
      'server');

  });

});

test('edit server and save', function() {
  visit('/servers');
  click('#server-1 a');

  fillIn('#server-name', 'TestServer');
  click('button');

  andThen(function() {
    var serverRecord = store.getById('server', 1);
    var serverMenuItem = find('#server-1');

    //the record was successfully changed
    equal(
      serverRecord.get('name'),
      'TestServer');

    //the changes were saved, so we should be able to find the new title
    notEqual(serverMenuItem.html().indexOf('TestServer'), -1);
    equal(
      currentRouteName(),
      'servers.index');

  });

});
