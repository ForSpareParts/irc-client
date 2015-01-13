/* jshint expr:true */
import Ember from 'ember';
import {
  describeModel,
  it
} from 'ember-mocha';

var requests;

var connection;
var store;

var requestSpy = function(event, request, settings) {
  var data = settings.data;

  if (typeof(data) === 'string') {
    data = JSON.parse(data);
  }

  requests.push({
    method: settings.type,
    data: data,
    responseData: request.responseJSON,
    responseCode: request.status,
    url: settings.url
  });
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
        'model:message',
        'transform:array']
  },
  function() {
    beforeEach(function() {
      requests = [];
      store = this.store();

      Ember.$(document).on('ajaxSend', requestSpy);

      andThen(function() {
        store.find('connection', 1)
        .then(function(record) {
          connection = record;
        });
      });
    });

    afterEach(function() {
      Ember.$(document).off('ajaxSend', requestSpy);
    });

    it('refuses to be created or deleted', function() {

      //create:
      isRejected(function() {
        return store.createRecord('connection').save();
      });

      //delete:
      isRejected(function() {
        return connection.destroyRecord();
      });

      andThen(function() {
        //make sure we didn't hit the server
        var nonGetRequests = requests.filter(function(request) {
          return request.method !== 'GET';
        });
        assert.equal(nonGetRequests.length, 0);
      });
    });

    it('performs an update as two separate requests', function() {
      andThen(function() {
        connection.set('connected', true);
        connection.set('joined', ['#channelname']);
        return assert.isFulfilled(connection.save());
      });

      andThen(function() {
        var postRequests = requests.filter(function(request) {
          return request.method === 'POST';
        });
        assert.strictEqual(postRequests.length, 2);

        assert.strictEqual(
          postRequests[0].url,
          'api/servers/1/connection/connected');
        assert.deepEqual(
          postRequests[0].data,
          { connected: true });

        assert.strictEqual(
          postRequests[1].url,
          'api/servers/1/connection/joined');
        assert.deepEqual(
          postRequests[1].data,
          { joined: ['#channelname'] });
      });
    });
  }
);
