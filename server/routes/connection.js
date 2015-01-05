var express = require('express');

var connection = require('../connection');
var models = require('../models');


var router = express.Router();

//we can access the connection's Server at req.server

/**
 * Send a quick summary of the connection.
 */
router.route('/')
  .get(function(req, res) {
    res.send({
      connection : {
        id: req.server.id,
        connected: req.server.connection().isConnected(),
        server: req.server.id,
        joined: req.server.connection().getJoinedChannels()
      }
    });
  })

  .all(function(req, res) {
    res.status(405).send({
      message:
        'connection resource is read-only, use subpaths to edit a connection'
    });
  });

router.route('/connected')
  /** Get connection state. */
  .get(function(req, res) {
    res.send({
      connected: req.server.connection().isConnected()
    });
  })

  /** Update connection state (connect/disconnect). */
  .post(function(req, res) {
    if (req.body.connected === true) {
      req.server.connection().connect().then(function() {
        res.send({connected: true});
      });
    }

    else if (req.body.connected === false) {
      req.server.connection().disconnect().then(function() {
        res.send({connected: false});
      });
    }
  });


router.route('/joined')

  .get(function(req, res) {
    res.send({
      joined: req.server.connection().getJoinedChannels()});
  })

  .post(function(req, res) {
    req.server.connection().setJoinedChannels(req.body.joined);

    res.send({
      joined: req.server.connection().getJoinedChannels()});
  })

  .put(function(req, res) {
    req.server.connection().addJoinedChannels(req.body.joined);

    res.send({
      joined: req.server.connection().getJoinedChannels()});
  });

module.exports = router;
