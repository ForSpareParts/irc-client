import Ember from 'ember';
import startApp from '../helpers/start-app'; // change this due to your folder hierarchy
import { describeModule, it } from 'ember-mocha';
/* global assert */

var App;
var store;

describeModule('route:channels', 'Channels', {}, function() {

  beforeEach(function(){
    App = startApp();
    store = App.__container__.lookup('store:main');
  });

  afterEach(function(){
    Ember.run(App, 'destroy');
  });

  it('should join a new channel', function() {

    var menuItems = null;
    var channelCountAtStart = null;

    visit('/channels');

    andThen(function() {
      menuItems = find('.nav-items li');
      channelCountAtStart = store.all('channel').get('length');

      //there's one menu item for every channel, plus one for the 'create' link
      assert.strictEqual(
        menuItems.length,
        channelCountAtStart + 1);
    });

    click('li.new a');
    fillIn('#channel-name', '#testchannel');
    fillIn('#server', '1');
    click('button');

    andThen(function() {
      menuItems = find('.nav-items li');
      assert.strictEqual(
        menuItems.length,
        channelCountAtStart + 2);

      assert.strictEqual(
        currentRouteName(),
        'channel');
    });

  });

  it('should show the channel view', function() {
    visit('/channels/1');

    //get the channel's messages, and make sure we're showing all of them
    store.find('channel', 1);

    andThen(function(channel){
      var uiMessages = find('ul.messages li');

      assert.strictEqual(
        uiMessages.length,
        channel.get('messages').get('length'));
    });
  });

  it('should send a message', function() {
    visit('/channels/1');

    andThen(function() {
      //the test message shouldn't exist before submitting...
      var message = find('ul.messages li').last();
      assert.strictEqual(message.html().indexOf('test message!'), -1);
    });

    fillIn('#message-input', "test message!");
    keyEvent(
      null,
      '#message-input',
      'keypress',
      13); //13 is the code for the enter key


    andThen(function() {
      //...but should exist afterward
      var messageAfter = find('ul.messages li').last();
      assert.ok(messageAfter.html().indexOf('test message!') > -1);

      //the timestamp should also be populated
      //(this can get screwed up if the time input to the model is bad)
      notStrictEqual(messageAfter.find('.time').text(), '');

      //the input should be cleared
      assert.strictEqual(
        find('#message-input').val(),
        '');
    });
  });

  it('should not send a nessage if the message box is empty', function() {
    var expectedMessageCount = null;

    visit('/channels/1');

    andThen(function() {
      //get the current number of messages
      expectedMessageCount = find('ul.messages li').length;
    });

    fillIn('#message-input', '');
    keyEvent(
      null,
      '#message-input',
      'keypress',
      13); //13 is the code for the enter key

    andThen(function() {
      //make sure that the number of messages hasn't changed
      assert.strictEqual(find('ul.messages li').length, expectedMessageCount);
    });
  });


});
