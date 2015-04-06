/* jshint expr:true */
import {
  describeModel,
  it
} from 'ember-mocha';
/* global moment */

var UTC_STRING = "2015-01-10T12:05:00.000Z";

describeModel(
  'message',
  'Message',
  {
    // Specify the other units that are required for this test.
    needs: [
      'model:connection',
      'model:server',
      'model:channel',
      'model:message',
      'transform:isodate'
    ]
  },
  function() {
    it('should expose the formatted time as a property', function() {
      var message = this.subject({
        time: moment(UTC_STRING).utc()
      });

      equal(message.get('shortTime'), '12:05 PM');
    });

    it('should expose a message\'s type via properties', function() {
      var message = this.subject({
        type: 'join'
      });

      assert.isTrue(message.get('isJoin'));
      assert.isTrue(message.get('isEvent'));

      message.set('type', 'part');      
      assert.isTrue(message.get('isPart'));
      assert.isTrue(message.get('isEvent'));

      message.set('type', '');
      assert.isFalse(message.get('isEvent'));
    });

  }
);
