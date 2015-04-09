/* jshint expr:true */
import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;
var store;

describe('Acceptance: Channels', function() {
  beforeEach(function(){
    App = startApp();
    store = App.__container__.lookup('store:main');

    //connect to a server so we can join channels
    visit('/');
    click('#servers-modal-trigger');
    click('#server-1 a');
    click('#connect-button');
    click('.close');
  });

  afterEach(function(){
    Ember.run(App, 'destroy');
  });

  it('should join and a part a channel', function() {
    andThen(function() {
      equal(channelMenuItems().length, 0);
    });

    joinChannel('#testchannel', 'FooServer');

    andThen(function() {
      equal(channelMenuItems().length, 1);
      equal(currentRouteName(), 'channel');
    });

    click('#channel-menu-3 .part-button');

    andThen(function() {
      equal(channelMenuItems().length, 0);
      equal(currentRouteName(), 'index');
    });
  });

  it('should rejoin an existing channel', function() {
    andThen(function() {
      equal(channelMenuItems().length, 0);
    });

    joinChannel('#somechannel', 'FooServer');

    andThen(function() {
      equal(channelMenuItems().length, 1);      
    });
  });

  it('should send a message', function() {
    joinChannel('#somechannel', 'FooServer');

    andThen(function() {
      //the test message shouldn't exist before submitting...
      var message = find('ul.messages li').last();
      equal(message.html().indexOf('test message!'), -1);
    });

    fillIn('#message-input', "test message!");
    keyEvent(
      '#message-input',
      'keypress',
      13); //13 is the code for the enter key


    andThen(function() {
      //...but should exist afterward
      var messageAfter = find('ul.messages li').last();
      assert.ok(messageAfter.html().indexOf('test message!') > -1);

      //the timestamp should also be populated
      //(this can get screwed up if the time input to the model is bad)
      notEqual(messageAfter.find('.time').text(), '');

      //the input should be cleared
      equal(find('#message-input').val(), '');
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
      '#message-input',
      'keypress',
      13); //13 is the code for the enter key

    andThen(function() {
      //make sure that the number of messages hasn't changed
      equal(find('ul.messages li').length, expectedMessageCount);
    });
  });

});
