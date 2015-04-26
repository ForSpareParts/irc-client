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

require('mocha-sinon');

//load the promise extensions for Chai
chai.use(chaiAsPromised);

//load assert as a global so that it's available in all tests
assert = chai.assert;


/**
 * project dependencies
 */

//put the project in test mode
var argv = require('yargs').argv;
argv.settings = 'test';

var fixtures = require('../models/fixtures')
  , connection = require('../connection')
  , emitter = require('../emitter')
  , knexfile = require('../knexfile')
  , models = require('../models')
  , deleteDatabase = require('../test_utils').deleteDatabase;

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
  connection.clearConnections();
  emitter.removeAllListeners();
  return models.truncateAll();
});

after(function () {
  //wipe out the database itself after all tests

  //this is important in case we're editing migrations: the migration history
  //may still show those migrations as run, preventing the database from being
  //updated to the new schema.

  deleteDatabase();
});
