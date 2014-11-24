var express = require('express');

var connection = require('../connection');
var models = require('../models');


var router = express.Router();

//we can access the connection's Server at req.record

/**
 * Send a quick summary of the connection.
 */
router.get('/', function(req, res) {
  res.send({
    connected: req.record.connection().isConnected(),
    server: req.record.id,
    joined: req.record.connection().getJoinedChannels()
  });
});


router.route('/connected')
  /** Get connection state. */
  .get(function(req, res) {
    res.send({
      connected: req.record.connection().isConnected()
    });
  })

  /** Update connection state (connect/disconnect). */
  .post(function(req, res) {
    if (req.body.connected == true) {
      req.record.connection().connect().then(function() {
        res.send({connected: true});
      });
    }

    else if (req.body.connected == false) {
      req.record.connection().disconnect().then(function() {
        res.send({connected: false});
      });
    }
  });


router.route('/joined')

  .get(function(req, res) {
    res.send({
      joined: req.record.connection().getJoinedChannels()});
  })

  .post(function(req, res) {
    req.record.connection().setJoinedChannels(req.body.joined);

    res.send({
      joined: req.record.connection().getJoinedChannels()});
  })

  .put(function(req, res) {
    req.record.connection().addJoinedChannels(req.body.joined);

    res.send({
      joined: req.record.connection().getJoinedChannels()});
  });

module.exports = router;
