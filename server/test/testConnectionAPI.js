/**
 * Test accessing IRC server connections through the API.
 */

var sinon = require('sinon');

var app = require('../app')
  , request = require('supertest-as-promised')(app);

var connectionLib = require('../models/server/connection');

require('mocha-sinon');


var server = null;

describe('The connection API', function() {

  beforeEach(function() {
    //clear out all connection information between tests
    connectionLib.clearConnections();

    return require('../models/server').get(1)
    .then(function(fetched) {
      server = fetched;
    });

  });

  it('should show Servers as initially disconnected', function() {
    return request.get('/connections/1')

    .expect(200)
    .expect({connected: false, server: 1, channels: []});
  });

  it('should connect when requested', function() {
    var callback = sinon.spy();
    var connection = server.connection();

    //set a test spy so we know that the IRC client is asked to connect
    connection.client.on('registered', callback);

    return request.post('/connections/1/connected')

    .send({connected: true})
    .expect(200)

    .then(function() {
      //check on the test spy!
      assert.isTrue(callback.calledOnce);

      return request.get('/connections/1/connected')
      .expect(200)
      .expect({connected: true});
    });

  });

  it('should disconnect when requested', function() {
    var callback = sinon.spy();
    var connection = server.connection();

    connection.client.on('quit', callback);

    return connection.connect()

    .then(function() {
      return request.post('/connections/1/connected')
      .send({connected: false})
      .expect(200);
    })

    .then(function() {
      //check on the test spy!
      assert.isTrue(callback.calledOnce);

      return request.get('/connections/1/connected')
      .expect(200)
      .expect({connected: false});
    });

  });

  it('should replace all joined channels on a POST to /channels', function() {
    var callback = sinon.spy();
    var connection = server.connection();

    //we should leave #channelA and join #channelC
    connection.client.on('part#channelA', callback);
    connection.client.on('join#channelC', callback);

    return connection.join('#channelA')

    .then(function() {
      return connection.join('#channelB');
    })

    .then(function() {
      return request.post('/connections/1/channels')

      .send({channels: ['#channelB', '#channelC']})
      .expect(200)
      .expect({channels: ['#channelB', '#channelC']});
    })

    .then(function() {
      assert.isTrue(callback.calledTwice);

      return request.get('/connections/1/channels')

      .expect(200)
      .expect({channels: ['#channelB', '#channelC']});
    });

  });
});
