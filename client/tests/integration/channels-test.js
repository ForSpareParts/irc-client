import Ember from 'ember';
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

test('send message', function() {
  expect(4);
  visit('/channels/1');

  andThen(function() {
    //the test message shouldn't exist before submitting...
    var message = find('ul.messages li').last();
    equal(message.html().indexOf('test message!'), -1);
  });


  fillIn('#message-input', "test message!");
  keyEvent('#message-input', 'keypress', 13); //13 is the code for the enter key

  andThen(function() {
    //...but should exist afterward
    var messageAfter = find('ul.messages li').last();
    ok(messageAfter.html().indexOf('test message!') > -1);

    //the timestamp should also be populated
    //(this can get screwed up if the time input to the model is bad)
    notStrictEqual(messageAfter.find('.time').text(), '');

    //the input should be cleared
    equal(
      find('#message-input').val(),
      '');
  });
});

test('no message sent if message box is empty', function() {
  expect(1);
  visit('/channels/1');
  var expectedMessageCount = null;

  andThen(function() {
    //get the current number of messages
    expectedMessageCount = find('ul.messages li').length;
  });

  //make the message box empty, and focus it...
  fillIn('#message-input', '');
  keyEvent('#message-input', 'keypress', 13); //13 is the code for the enter key

  andThen(function() {
    //make sure that the number of messages hasn't changed
    equal(find('ul.messages li').length, expectedMessageCount);
  });
});
