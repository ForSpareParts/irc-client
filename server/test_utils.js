/**
 * Tools for resetting the app and its data without killing the current process.
 * Used in unit tests, but also exposed as routes so that the Ember tests can
 * leverage the same functionality.
 */
var Promise = require('bluebird');
var express = require('express');

var fixtures = require('./models/fixtures')
  , knexfile = require('./knexfile')
  , models = require('./models')
  , connection = require('./connection');

var router = express.Router();

module.exports.deleteTestDatabase = function() {
  var dbFilePath = knexfile.test.connection.filename;
  fs.unlinkSync(dbFilePath);
}

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

router.post('/test/teardown', function() {
  module.exports.deleteTestDatabase();
  res.send({success: true});
});

module.exports.router = router;
