var Promise = require('bluebird')
  , request = Promise.promisifyAll(require('request'));


describe('The basic CRUD API', function() {
  it('should get data for all models of a type', function() {
    return request.getAsync(HOST + '/servers')

    .spread(function(response, body) {
      servers = JSON.parse(body).servers;

      assert.strictEqual(servers.length, 2);
      assert.strictEqual(servers[0].name, "FooServer");
    });
  });

  it('should get data for a specific model by id', function() {
    return request.getAsync(HOST + '/channels/1')
    
    .spread(function(response, body) {
      channel = JSON.parse(body).channel;
      assert.strictEqual(channel.name, "#somechannel");
    });
  });

  it('should update models by id', function() {
    return request.putAsync(HOST + '/users/3', {
      json: {
       user: {nickname: 'aDifferentUserNick'}
      }
    })

    .spread(function(response, body) {
      //because we sent json in the request, body is already parsed
      user = body.user;

      assert.strictEqual(user.id, '3');
      assert.strictEqual(user.nickname, 'aDifferentUserNick');
    });
  });

  it('should create new models', function() {
    return request.postAsync(HOST + '/messages/', {
      json: {
        message: {
              user_id: 1,
              channel_id: 1,
              time: Date('2000-01-01T00:02:00'),
              contents: 'test message'
        }
      }
    })

    .spread(function(response, body) {
      //because we sent json in the request, body is already parsed
      message = body.message;
      assert.strictEqual(message.contents, 'test message');
    });
  });

  it('should destroy models by id', function() {
    return request.delAsync(HOST + '/servers/1')

    .spread(function(response, body) {
      body = JSON.parse(body);

      //make sure the request says it was successful
      assert.deepEqual(body, {success: true});

      return request.getAsync(HOST + '/servers/1');
    })

    .spread(function(response, body) {
      assert.strictEqual(response.statusCode, 404);
    });

  });

  it('should 404 for missing models', function() {

    //this model does not exist, and should 404
    return request.getAsync(HOST + '/users/42')
    
    .spread(function (response, body) {
      assert.strictEqual(response.statusCode, 404);
    });
  });

  it('should 404 for invalid paths', function() {

    return request.getAsync(HOST + '/foobar')
    
    .spread(function (response, body) {
      assert.strictEqual(response.statusCode, 404);
    });
  });
});
