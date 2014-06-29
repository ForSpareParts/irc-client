import startApp from '../helpers/start-app'; // change this due to your folder hierarchy

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