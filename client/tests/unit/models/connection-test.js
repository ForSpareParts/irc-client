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
    try {
      data = JSON.parse(data);
    }
    catch (SyntaxError) {
      //do nothing
    }
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
        'adapter:application',
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

    it('refuses to perform findQuery', function() {
      isRejected(function() {
        return store.find('connection', { param: 'value'});
      });
    });

    it('performs an update', function() {
      andThen(function() {
        connection.set('connected', true);
        connection.set('joined', ['#channelname']);
        return assert.isFulfilled(connection.save());
      });

      andThen(function() {
        var patchRequests = requests.filter(function(request) {
          return request.method === 'PATCH';
        });
        equal(patchRequests.length, 1);

        equal(patchRequests[0].url, '/api/connections/1');
        assert.deepEqual(
          patchRequests[0].data,
          { connection: {
            server: '1',
            connected: true,
            joined: ['#channelname']
            }
          });

      });
    });
  }
);
