/* jshint expr:true */
import {
  describeModel,
  it
} from 'ember-mocha';

describeModel(
  'message',
  'Message',
  {
    // Specify the other units that are required for this test.
    needs: [
      'adapter:message',
      'model:connection',
      'model:server',
      'model:channel',
      'model:message',
      'transform:isodate'
    ]
  },
  function() {
    it('should receive messages from the server', function() {
      var model = this.subject();
      var store = this.store();

      var adapter = this.container.lookup('adapter:message');

      andThen(function() {
        adapter.socket.localEmit('message', {
          message: {
            id: 100,

            nick: "testSocketNick",
            channel_id: 1,
            time: new Date('2000-01-01T00:00:00').toISOString(),

            contents: 'This message is fake!'
          }
        });
      });

      andThen(function() {
        var message = store.getById('message', 100);

        equal(message.get('nick'), 'testSocketNick');
        equal(message.get('contents'), 'This message is fake!');
      });


    });

  }
);
