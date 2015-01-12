/* jshint expr:true */
import Ember from 'ember';
import {
  describeModel,
  it
} from 'ember-mocha';

var getRequests = null;
var otherRequests = null;

var requestSpy = function(event, request, settings) {
  if (settings.type === 'GET') {
    getRequests.push(request);
  }
  else {
    otherRequests.push(request);
  }
};

describeModel(
  'connection',
  'Connection',
  {
    // Specify the other units that are required for this test.
      needs: [
        'adapter:connection',
        'model:server',
        'model:channel',
        'transform:array']
  },
  function() {
    beforeEach(function() {
      getRequests = [];
      otherRequests = [];

      Ember.$(document).on('ajaxSend', requestSpy);
    });

    afterEach(function() {
      Ember.$(document).off('ajaxSend', requestSpy);
    });

    it('refuses to be created or deleted', function() {

      //create:
      var store = this.store();

      isRejected(function() {
        return store.createRecord('connection').save();
      });

      //delete:
      isRejected(function() {
        return store.find('connection', 1)
        .then(function(connection){
          return connection.destroyRecord();
        });
      });

      andThen(function() {
        //make sure we didn't hit the server
        assert.equal(otherRequests.length, 0);
      });
    });
  }
);
