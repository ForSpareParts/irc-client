/**
 * Tools for resetting the app and its data without killing the current process.
 * Used in unit tests, but also exposed as routes so that the Ember tests can
 * leverage the same functionality.
 */
var Promise = require('bluebird');
var express = require('express');

var fixtures = require('./models/fixtures')
  , knexfile = require('./knexfile')
  , models = require('./models');

var router = express.Router();

module.exports.deleteTestDatabase = function() {
  var dbFilePath = knexfile.test.connection.filename;
  fs.unlinkSync(dbFilePath);
}

module.exports.truncateAll = models.truncateAll;
module.exports.migrateLatest = models.migrateLatest;
module.exports.loadFixtures = fixtures.loadAll;


router.post('/truncate', function(req, res) {
  models.truncateAll()

  .then(function() {
    res.send({truncated: true});
  });
});

router.post('/migrate', function(req, res) {
  models.migrateLatest()
  .then(function() {
    res.send({migrated: true});
  });
});

router.post('/load_fixtures', function(req, res) {
  fixtures.loadAll()
  .then(function() {
    res.send({loaded: true});
  });
});

router.post('/clear_db_file', function(req, res) {
  module.exports.deleteTestDatabase();
  res.send({cleared: true});
});

module.exports.router = router;
