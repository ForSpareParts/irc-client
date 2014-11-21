var express = require('express');

var connection = require('../models/server/connection');
var models = require('../models');


var router = express.Router();


router.use('/:id', function(req, res, next) {

  //use the server id to get a connection object and put it on the request
  models.Server.get(req.params.id)

  .then(function(server) {
    req.server = server;
    req.connectionInstance = connection.getConnection(
      req.server.get('host'),
      req.server.get('port'),
      req.server.get('nick'));

    next();
  })

  .catch(models.Server.NotFoundError, function(error) {
    res.status(404).send({
      error: error
    });
  });
});

/**
 * Send a quick summary of the connection.
 */
router.get('/:id', function(req, res) {
  res.send({
    connected: req.connectionInstance.isConnected(),
    server: req.server.id,
    channels: req.connectionInstance.getCurrentChannels()
  });
});


router.route('/:id/connected')
  /** Get connection state. */
  .get(function(req, res) {
    res.send({
      connected: req.connectionInstance.isConnected()
    });
  })

  /** Update connection state (connect/disconnect). */
  .post(function(req, res) {
    if (req.body.connected == true) {
      req.connectionInstance.connect().then(function() {
        res.send({connected: true});
      });
    }

    else if (req.body.connected == false) {
      req.connectionInstance.disconnect().then(function() {
        res.send({connected: false});
      });
    }
  });

module.exports = router;
