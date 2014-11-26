/**
 * Test the database REST API, which provides access to database models (Server,
 * Channel, and Message).
 */

var app = require('../app')
  , request = require('supertest-as-promised')(app);


describe('The database access API', function() {
  it('should get data for all models of a type', function() {
    return request.get(NAMESPACE + '/servers')

    .expect(200)
    .then(function(res) {
      var servers = res.body.servers;

      assert.strictEqual(servers.length, 2);
      assert.strictEqual(servers[0].name, "FooServer");
    });
  });

  it('should get data for a specific model by id', function() {
    return request.get(NAMESPACE + '/channels/1')
    
    .expect(200)
    .then(function(res) {
      channel = res.body.channel;
      assert.strictEqual(channel.name, "#somechannel");
    });
  });

  it('should update models by id', function() {
    return request.put(NAMESPACE + '/channels/1')
    .send({
       channel: {name: '#newchannelname'}
    })

    .expect(200)
    .then(function(res) {
      channel = res.body.channel;

      assert.strictEqual(channel.id, 1);
      assert.strictEqual(channel.name, '#newchannelname');
    });
  });

  it('should create new models', function() {
    return request.post(NAMESPACE + '/messages/')
    .send({
      message: {
        nick: 'somenick',
        channel_id: 1,
        time: new Date('2000-01-01T00:02:00').toISOString(),
        contents: 'test message'
      }
    })

    .expect(200)
    .then(function(res) {
      message = res.body.message;
      assert.strictEqual(message.contents, 'test message');
    });
  });

  it('should destroy models by id', function() {
    return request.del(NAMESPACE + '/servers/1')

    .expect(200)

    .then(function(res) {
      //make sure the request says it was successful
      assert.deepEqual(res.body, {success: true});

      return request.get(NAMESPACE + '/servers/1').expect(404);
    });
  });

  it('should 404 for missing models', function() {
    //this model does not exist, and should 404
    return request.get(NAMESPACE + '/channels/42').expect(404);
  });

  it('should 404 for invalid paths', function() {
    return request.get(NAMESPACE + '/foobar').expect(404);
  });

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

});
