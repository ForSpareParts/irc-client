/**
 * Test the database REST API, which provides access to database models (Server,
 * Channel, and Message).
 */

var app = require('../../app')
  , request = require('supertest-as-promised')(app);


describe('The API', function() {
  it('should get data for all models of a type', function() {
    return request.get(NAMESPACE + '/servers')

    .expect(200)
    .then(function(res) {
      var servers = res.body.servers;

      equal(servers.length, 2);
      equal(servers[0].name, "FooServer");
    });
  });

  it('should get data for a specific model by id', function() {
    return request.get(NAMESPACE + '/channels/1')
    
    .expect(200)
    .then(function(res) {
      channel = res.body.channel;
      equal(channel.name, "#somechannel");
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

      equal(channel.id, 1);
      equal(channel.name, '#newchannelname');
    });
  });

  it('should create new models', function() {
    return request.post(NAMESPACE + '/channels/')
    .send({
      channel: {
        name: '#createchannel',
        server: 1,
      }
    })

    .expect(200)
    .then(function(res) {
      channel = res.body.channel;
      equal(channel.name, '#createchannel');
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

  it('should show related models as modelname, instead of modelname_id',
    function() {
      //ember prefers this format; e.g. server: 1, instead of server_id: 1
      return request.get(NAMESPACE + '/channels/1')

      .expect(200)

      .then(function(res) {
        equal(res.body.channel.server, 1);
        assert.notProperty(res.body.channel, 'server_id');
      });
    });

});
