var Promise = require('bluebird');
var express = require('express');

var connection = require('../connection');
var Server = require('../models/server');


var allRouter = express.Router();
var singleRouter = express.Router();

//we can access the connection's Server at req.server

allRouter.get('/', function(req, res) {
  Server.all()

  .then(function(servers) {
    var innerData = servers.map(function(server) {
      return server.connectionJSON(false);
    });

    res.send({ connections: innerData });
  });
});

allRouter.use('/:id', function(req, res, next) {
  //we're coming in from a /connections/:id route
  //fill the server in on req.server so we can use it later

  //server ID is always identical to connection ID
  Server.get(req.params.id)

  .then(function(server) {
    req.server = server;
    next();
  });
});

allRouter.use('/:id', singleRouter);


/**
 * Send a quick summary of the connection.
 */
singleRouter.route('/')
  .get(function(req, res) {
    res.send(req.server.connectionJSON());
  })

  .put(function(req, res) {
    var updated = req.body.connection;
    var connection = req.server.connection();

    return connection.setConnected(updated.connected)

    .then(function() {
      return connection.setJoinedChannels(updated.joined);
    })

    .then(function() {
      res.send(req.server.connectionJSON());
    });
  })

  .all(function(req, res) {
    res.status(405).send({
      message: 'Connection model only accepts GET and PUT.'});
  });

module.exports.singleRouter = singleRouter;
module.exports.allRouter = allRouter;
