/* jshint expr:true */
import Ember from 'ember';
import {
  describeModule,
  it
} from 'ember-mocha';
/* global sinon */

var stub;

var MESSAGE_JSON = {
  message: {
    id: 100,

    nick: "testSocketNick",
    channel_id: 1,
    time: new Date('2000-01-01T00:00:00').toISOString(),

    contents: 'This message is fake!'
  }
};

describeModule(
  'adapter:message',
  'MessageAdapter',
  {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  },
  function() {

    beforeEach(function() {
      stub = sinon.stub().returns(Ember.RSVP.resolve(null));

      this.container.register('store:main', Ember.Object.extend({
        pushPayload: stub
      }));
    });

    // Replace this with your real tests.
    it('should receive messages from the server', function() {
      var adapter = this.subject();

      andThen(function() {
        adapter.socket.localEmit('message', MESSAGE_JSON);
      });

      andThen(function() {
        stub.calledWith(MESSAGE_JSON);
      });
    });
  }
);
