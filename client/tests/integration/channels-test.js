import startApp from '../helpers/start-app'; // change this due to your folder hierarchy

var App;
var store;

module('Channels', {
  setup: function(){
    App = startApp();
    store = App.__container__.lookup('store:main');

  },
  teardown: function(){
    Ember.run(App, 'destroy');
  }
});

test('join new channel', function() {
  visit('/channels');

  andThen(function() {
    var menuItems = find('.nav-items li');
    var channelCountAtStart = store.all('channel').get('length');

    //there's one menu item for every channel, plus one for the 'create' link
    equal(
      menuItems.length,
      channelCountAtStart + 1);

    click('li.new a');
    fillIn('#channel-name', '#testchannel');
    fillIn('#server', '1');
    click('button');

    andThen(function() {
      menuItems = find('.nav-items li');
      equal(
        menuItems.length,
        channelCountAtStart + 2);

      equal(
        currentRouteName(),
        'channel');
    });

  });
});

test('channel view', function() {
  expect(1);
  visit('/channels/1');

  andThen(function() {
    var uiMessages = find('ul.messages li');
    
    //get the channel's messages, and make sure we're showing all of them
    store.find('channel', 1).then(function(channel){
      equal(
        uiMessages.length,
        channel.get('messages').get('length'));
    });

  });
});