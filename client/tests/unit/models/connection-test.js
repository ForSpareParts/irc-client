/* jshint expr:true */
import Ember from 'ember';
import {
  describeModel,
  it
} from 'ember-mocha';
/* global sinon */

var NULL_PROMISE = Ember.RSVP.Promise.resolve(null);

var requests;

var connection;
var store;

describeModel(
  'connection',
  'Connection',
  {
    // Specify the other units that are required for this test.
      needs: [
        'model:server',
        'model:channel',
        'model:message',
        'transform:array']
  },
  function() {
    it('should join a channel', function() {
      var channel = this.subject({
        connected: true,
        joined: []
      });

      var stub = sinon.stub(channel, 'save').returns(NULL_PROMISE);

      channel.join(Ember.Object.create({
        name: '#somechannel'}));

      assert.include(channel.get('joined'), '#somechannel');
      assert.isTrue(stub.called);
    });

    it('should do nothing if asked to join a channel it\'s already in',
      function() {
        var channel = this.subject({
          connected: true,
          joined: ['#somechannel']
        });

        var stub = sinon.stub(channel, 'save').returns(NULL_PROMISE);

        channel.join(Ember.Object.create({
          name: '#somechannel'}));

        assert.isTrue(stub.notCalled);
      }
    );
  }
);
