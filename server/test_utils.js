/**
 * Tools for resetting the app and its data without killing the current process.
 * Used in unit tests, but also exposed as routes so that the Ember tests can
 * leverage the same functionality.
 */
var fs = require('fs');
var Promise = require('bluebird');
var express = require('express');
var fs = require('fs');

var fixtures = require('./models/fixtures')
  , knexfile = require('./knexfile')
  , models = require('./models')
  , connection = require('./connection')
  , settings = require('./settings');

var router = express.Router();

module.exports.deleteDatabase = function() {
  var dbFilePath = knexfile[settings.databaseConfig].connection.filename;

  //if we're using the in-memory database, there's nothing to delete
  if (dbFilePath != ':memory:') {
    fs.unlinkSync(dbFilePath);
  }
};

module.exports.truncateAll = models.truncateAll;
module.exports.migrateLatest = models.migrateLatest;
module.exports.loadFixtures = fixtures.loadAll;

router.post('/test/setup', function(req, res) {
  models.migrateLatest()

  .then(models.truncateAll)

  .then(fixtures.loadAll)

  .then(function() {
    connection.clearConnections();
    res.send({success: true});
  });
});

router.post('/test/reset', function(req, res) {
  models.truncateAll()

  .then(fixtures.loadAll)

  .then(function() {
    connection.clearConnections();
    res.send({success: true});
  });
});

router.post('/test/teardown', function(req, res) {
  module.exports.deleteDatabase();
  res.send({success: true});
});

module.exports.router = router;
