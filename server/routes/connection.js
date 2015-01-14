var Promise = require('bluebird');
var express = require('express');

var connection = require('../connection');
var models = require('../models');


var router = express.Router();

//we can access the connection's Server at req.server

var serverConnectionJSON = function(server){
  var connection = server.connection();
  return {
    connection : {
      id: server.id,
      connected: connection.isConnected(),
      server: server.id,
      joined: connection.getJoinedChannels()
    }
  };
};

/**
 * Send a quick summary of the connection.
 */
router.route('/')
  .get(function(req, res) {
    res.send(serverConnectionJSON(req.server));
  })

  .patch(function(req, res) {
    var promise = Promise.resolve(null);

    var updated = req.body.connection;
    var connection = req.server.connection();

    //only update the connection if something has changed
    if (updated.connected !== undefined) {
      promise.then(function() {
        return connection.setConnected(updated.connected);
      });
    }

    if (updated.joined !== undefined) {
      promise.then(function() {
        return connection.setJoinedChannels(updated.joined);
      });
    }

    promise.then(function() {
      res.send(serverConnectionJSON(req.server));
    });
  })

  .all(function(req, res) {
    res.status(405).send({
      message: 'Connection model only accepts GET and PATCH.'});
  });

module.exports = router;
