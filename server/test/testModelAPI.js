/**
 * Test the database REST API, which provides access to database models (Server,
 * Channel, and Message).
 */

var app = require('../app')
  , request = require('supertest-as-promised')(app);


describe('The database access API', function() {
  it('should get data for all models of a type', function() {
    return request.get('/servers')

    .expect(200)
    .then(function(res) {
      var servers = res.body.servers;

      assert.strictEqual(servers.length, 2);
      assert.strictEqual(servers[0].name, "FooServer");
    });
  });

  it('should get data for a specific model by id', function() {
    return request.get('/channels/1')
    
    .expect(200)
    .then(function(res) {
      channel = res.body.channel;
      assert.strictEqual(channel.name, "#somechannel");
    });
  });

  it('should update models by id', function() {
    return request.put('/channels/1')
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
    return request.post('/messages/')
    .send({
      message: {
        nick: 'somenick',
        channel_id: 1,
        time: Date('2000-01-01T00:02:00'),
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
    return request.del('/servers/1')

    .expect(200)

    .then(function(res) {
      //make sure the request says it was successful
      assert.deepEqual(res.body, {success: true});

      return request.get('/servers/1').expect(404);
    });
  });

  it('should 404 for missing models', function() {
    //this model does not exist, and should 404
    return request.get('/channels/42').expect(404);
  });

  it('should 404 for invalid paths', function() {
    return request.get('/foobar').expect(404);
  });
});
