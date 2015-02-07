/* jshint expr:true */
import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;
var store;

describe('Acceptance: the Servers modal', function() {
  beforeEach(function() {
    App = startApp();
    store = App.__container__.lookup('store:main');

    visit('/');
    click('#servers-modal-trigger');
  });

  afterEach(function() {
    Ember.run(App, 'destroy');
  });

  it('should add a new server', function() {
    var menuItems = null;
    var serverCountAtStart = null;

    andThen(function() {
      menuItems = find('.server-menu li');
      serverCountAtStart = store.all('server').get('length');

      //there's one menu item for every server, plus one for the 'create' link
      equal(menuItems.length, serverCountAtStart);
    });

    click('.server-menu a.create');

    fillIn('#server-name', 'TestServer');
    fillIn('#host', 'irc.test.net');
    fillIn('#port', '1234');
    click('#save-button');

    andThen(function() {
      menuItems = find('.server-menu li');
      equal(menuItems.length, serverCountAtStart + 1);
    });
  });

  it('should edit a server and discard', function() {
    var serverRecord = null;
    var serverMenuItem = null;

    click('#server-1');

    fillIn('#server-name', 'TestServer');
    
    //leaving without clicking save should discard the changes
    click('#server-2 a');

    andThen(function() {
      serverRecord = store.getById('server', 1);
      serverMenuItem = find('#server-1');

      //the record hasn't changed
      equal(serverRecord.get('name'), 'FooServer');

      //the changes weren't saved, so 'TestServer' shouldn't be in the HTML
      equal(serverMenuItem.html().indexOf('TestServer'), -1);
    });

  });

  it('should edit a server and save', function() {
    var serverRecord = null;
    var serverMenuItem = null;

    click('#server-1 a');
    fillIn('#server-name', 'TestServer');
    click('#save-button');

    andThen(function() {
      serverRecord = store.getById('server', 1);
      serverMenuItem = find('#server-1');

      //the record was successfully changed
      equal(serverRecord.get('name'), 'TestServer');

      //the changes were saved, so we should be able to find the new title
      notEqual(serverMenuItem.html().indexOf('TestServer'), -1);

    });
  });

  it('should refuse to save a server that doesn\'t validate', function() {
    click('.server-menu a.create');
    click('#save-button');

    andThen(function() {
      assert.ok(find('.save-failed').text().indexOf('could not save') > -1);
    });
  });
});
