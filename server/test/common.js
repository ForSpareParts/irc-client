/**
 * Common setup for all tests.
 */

//load blanket for coverage. must happen first.
var blanket = require("blanket")({
   /* options are passed as an argument object to the require statement */
   "pattern": /^((?!(\/node_modules\/|\/test\/)).)*$/
 });


/**
 * external dependencies
 */

var chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , fs = require('fs')
  , knex = require('knex');

//load the promise extensions for Chai
chai.use(chaiAsPromised);

//load assert as a global so that it's available in all tests
assert = chai.assert;


/**
 * project dependencies
 */

var settings = require('../settings');

//use the test database
settings.databaseConfig = 'test';

//use the mock irc library
settings.ircLib = 'mock';

//disable http logging
settings.logRequests = false;

//disable IRC event handling
settings.listenToIRC = false;

var fixtures = require('../models/fixtures')
  , knexfile = require('../knexfile')
  , models = require('../models')
  , server = null;

var PORT = 3000;

//this is useful in other tests, so we also want to make it global
HOST = 'http://localhost:' + PORT;

NAMESPACE = '/api';

/**
 * root-level testing hooks
 */

before(function() {
  //create/update the test database
  return models.migrateLatest()

  //clear any existing data
  .then(models.truncateAll);
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