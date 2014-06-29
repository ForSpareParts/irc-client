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

test('edit server', function() {
  visit('/servers');
  click('#server-1 a');

  fillIn('#server-name', 'TestServer');
  click('button');

  andThen(function() {
    var serverRecord = store.getById('server', 1);
    var serverMenuItem = find('#server-1');

    equal(
      serverRecord.get('name'),
      'TestServer');
    ok(serverMenuItem.html().indexOf('TestServer') > -1);
    equal(
      currentRouteName(),
      'servers.index');

  });
});
