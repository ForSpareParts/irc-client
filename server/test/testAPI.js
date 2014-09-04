var chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , Promise = require('bluebird')
  , request = Promise.promisifyAll(require('request'))
  , knex = require('knex');

//load the promise extensions for Chai
chai.use(chaiAsPromised);
var assert = chai.assert;

var settings = require('../settings');

//use the test database
settings.databaseConfig = 'test';

var app = require('../app')
  , fixtures = require('../models/fixtures')
  , models = require('../models')
  , server = null;

var PORT = 3000;
var HOST = 'http://localhost:' + PORT;


before(function() {
  //set up the database, along with test data
  return models.migrateLatest()
    .then(function() {
      //start the server
      server = app.listen(PORT);
    });
});

beforeEach(function() {
  //TODO: would prefer to do this as a transaction, rather than loading/dropping
  //data every time
  return fixtures.loadAll();
});

afterEach(function() {
  //wipe out the data before the next test
  return models.truncateAll();
});


describe('The basic CRUD API', function() {
  it('should get data for all models of a type', function() {
    return request.getAsync(HOST + '/servers')

    .spread(function(response, body) {
      servers = JSON.parse(body);

      assert.strictEqual(servers.length, 2);
      assert.strictEqual(servers[0].name, "FooServer");
    });
  });

  it('should get data for a specific model by id', function() {
    return request.getAsync(HOST + '/channels/1')
    
    .spread(function(response, body) {
      channel = JSON.parse(body);
      assert.strictEqual(channel.name, "#somechannel");
    });
  });

  it('should update models by id', function() {
    return request.putAsync(HOST + '/users/3', {
      json: {nickname: 'aDifferentUserNick'}
    })

    .spread(function(response, body) {
      //because we sent json in the request, body is already parsed
      user = body;

      assert.strictEqual(user.id, '3');
      assert.strictEqual(user.nickname, 'aDifferentUserNick');
    });
  });

  it('should create new models', function() {
    return request.postAsync(HOST + '/messages/', {
      json: {
        user_id: 1,
        channel_id: 1,
        time: Date('2000-01-01T00:02:00'),
        contents: 'test message'
      }
    })

    .spread(function(response, body) {
      //because we sent json in the request, body is already parsed
      message = body;
      assert.strictEqual(message.contents, 'test message');
    });
  });
});
