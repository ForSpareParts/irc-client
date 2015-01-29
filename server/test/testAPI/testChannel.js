/**
 * Test the Channel route.
 */

var app = require('../../app')
  , request = require('supertest-as-promised')(app);

describe('The Channel API', function() {
  it('should get all channels for a server', function() {
    return request.get(NAMESPACE + '/servers/1/channels')
    .expect(200)
    .then(function(res) {
      //there's only one channel for server 1, so we should only get a single
      //record
      assert.strictEqual(res.body.channels.length, 1);
    });
  });

  it('should 404 for channels that do not belong to the indicated server',
    function() {
      //channel 1 does exist, but it doesn't belong to server 2 -- so the request
      //should 404
      return request.get(NAMESPACE + '/servers/2/channels/1')
      .expect(404);
  });

});