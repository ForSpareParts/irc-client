/**
 * Test the Server route.
 */

var app = require('../../app')
  , Server = require('../../models/server')
  , request = require('supertest-as-promised')(app);

var server;

var CONNECTION_JSON = {
  connection: {
    id: 1,
    connected: true,
    server: 1,
    joined: ['#somechannel']
  }
};

describe('The connection API', function() {
  it('should serve a JSON representation of active connections',
    function() {
      return Server.get(1)

      .then(function(fetched) {
        server = fetched;
        return server.connection().connect();
      })

      .then(function() {
        return server.connection().join('#somechannel');
      })

      .then(function() {
        return request.get(NAMESPACE + '/connections/')
        .then(function(response) {
          assert.lengthOf(response.body.connections, 2);
          assert.deepEqual(
            response.body.connections[0],
            CONNECTION_JSON.connection);
        });
      })

      .then(function() {
        return request.get(NAMESPACE + '/connections/1')
        .expect(CONNECTION_JSON);
      });
  });

  it('should prevent any write requests to connections', function() {
    return request.post(NAMESPACE + '/connections/')
    .send({})
    .expect(403)

    .then(function() {
      return request.put(NAMESPACE + '/connections/1')
      .send({})
      .expect(403)
    });
  });

});