/**
 * Test the Server route.
 */

var app = require('../../app')
  , request = require('supertest-as-promised')(app);

describe('The Server API', function() {
  it('should 403 for update/delete requests to a connected server.',
    function() {
      return request.patch(NAMESPACE + '/servers/1/connection')

      .send({
        connection: {
          connected: true
        }
      })

      .expect(200)

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