/**
 * Test the Message route.
 */

var app = require('../../app')
  , Server = require('../../models/server')
  , request = require('supertest-as-promised')(app);

describe('The Message API', function() {
  it('should get all messages for a channel', function() {
    return request.get(NAMESPACE + '/channels/1/messages')
    .expect(200)
    .then(function(res) {
      //we should only get the two messages in channel 1
      assert.strictEqual(res.body.messages.length, 2);
    });
  });

  it('should 404 for messages that do not belong to the indicated channel',
    function() {
      return request.get(NAMESPACE + '/channels/2/messages/1')
      .expect(404);      
  });

  it('should 405 if we try to create a message', function() {
    return request.post(NAMESPACE + '/messages/')
    .send({})
    .expect(405);
  });

  it('should 405 if we try to edit a message', function() {
    return request.put(NAMESPACE + '/messages/1')
    .send({})
    .expect(405);
  });

  it('should 405 if we try to delete a message', function() {
    return request.del(NAMESPACE + '/messages/1')
    .send({})
    .expect(405);
  });
});
