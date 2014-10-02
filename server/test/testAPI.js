var Promise = require('bluebird')
  , chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , fs = require('fs')
  , knex = require('knex')
  , request = Promise.promisifyAll(require('request'));

//load the promise extensions for Chai
chai.use(chaiAsPromised);
var assert = chai.assert;

var settings = require('../settings');

//use the test database
settings.databaseConfig = 'test';

var app = require('../app')
  , fixtures = require('../models/fixtures')
  , knexfile = require('../knexfile')
  , models = require('../models')
  , server = null;

var PORT = 3000;
var HOST = 'http://localhost:' + PORT;


before(function() {
  //create/update the test database
  return models.migrateLatest()

  //clear any existing data
  .then(models.truncateAll)

  //start the server
  .then(function() {
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

after(function () {
  //wipe out the database itself after all tests

  //this is important in case we're editing migrations: the migration history
  //may still show those migrations as run, preventing the database from being
  //updated to the new schema.
  var dbFilePath = knexfile.test.connection.filename;
  fs.unlinkSync(dbFilePath);

});

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

  it('should 404 for missing models', function() {

    //this model does not exist, and should 404
    return request.getAsync(HOST + '/users/42')
    
    .spread(function (response, body) {
      assert.strictEqual(response.statusCode, 404);
    });
  });
});
