/**
 * Test the Server route.
 */

var app = require('../../app')
  , Server = require('../../models/server')
  , request = require('supertest-as-promised')(app);

var CONNECTION_JSON = {
  connection: {
    id: 1,
    connected: true,
    server: 1,
    joined: []
  }
};

describe('The Server API', function() {
  it('should 403 for update/delete requests to a connected server.',
    function() {
      return Server.get(1)

      .then(function(server) {
        return server.connection().connect();
      })

      .then(function() {
        return request.put(NAMESPACE + '/servers/1')
        .send({})
        .expect(403);
      })

      .then(function() {
        return request.del(NAMESPACE + '/servers/1')
        .expect(403);
      });
  });
});