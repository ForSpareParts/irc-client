/**
 * Test accessing IRC server connections through the API.
 */

var sinon = require('sinon');

var app = require('../app')
  , request = require('supertest-as-promised')(app);

var connectionLib = require('../models/server/connection');
var Server = require('../models/server');

require('mocha-sinon');


describe('The connection API', function() {

  beforeEach(function() {
    //clear out all connection information between tests
    connectionLib.clearConnections();
  });

  it('should show Servers as initially disconnected', function() {
    return request.get('/connections/1')

    .expect(200)
    .then(function(res) {
      assert.strictEqual(res.body.connected, false);
    });
  });

  it('should connect when requested', function() {
    var callback = sinon.spy();

    return Server.get(1)

    .then(function(server) {
      var connection = server.connection();

      //set a test spy so we know that the IRC client is asked to connect
      connection.client.on('registered', callback);
    })

    .then(function() {
      return request.post('/connections/1/connected')
      .send({connected: true})
      .expect(200)
    })

    .then(function() {
      //check on the test spy!
      assert.isTrue(callback.calledOnce);

      return request.get('/connections/1/connected')
      .expect(200)
      .expect({connected: true});
    })

  });
});