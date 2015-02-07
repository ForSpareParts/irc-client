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

  it('should 400 if we try to create a message without a channel', function() {
    return request.post(NAMESPACE + '/messages')
    .send({
      message: {
        contents: 'Hello!'
      }
    })
    .expect(400);
  });

  it('should 400 if we specify two different channels on POST', function() {
    return request.post(NAMESPACE + '/channels/1/messages')
    .send({
      message: {
        contents: 'Hello!',
        channel: 2
      }
    });
  });

  it('should 405 if we try to edit a message', function() {
    return request.put(NAMESPACE + '/messages/1')
    .send({})
    .expect(405);
  });

  it('should 400 if we try to send a message from the wrong nick', function() {
    return request.post(NAMESPACE + '/channels/1/messages')
    .send({
      message: {
        contents: 'Hello!',
        nick: 'someUserNick'
      }
    })
    .expect(400);
  });

  it('should send a message if the server is connected and the channel is ' +
    'joined',
    function() {
      var server;
      return Server.get(1)
      .then(function(fetchedServer) {
        server = fetchedServer;
        return server.connection().connect();
      })
      .then(function() {
        return server.connection().join('#somechannel');
      })
      .then(function() {
        return request.post(NAMESPACE + '/channels/1/messages')
        .send({
          message: {
            contents: 'Hello!',
          }
        })
        .expect(200)
        .then(function(res) {
          assert.strictEqual(res.body.message.nick, 'myUserNick');
          assert.strictEqual(res.body.message.contents, 'Hello!');
        });
      });
  });
});
