var Promise = require('bluebird');
var express = require('express');

var connection = require('../connection');
var Server = require('../models/server');


var router = express.Router();

//we can access the connection's Server at req.server

router.get('/', function(req, res) {
  Server.all()

  .then(function(servers) {
    var innerData = servers.map(function(server) {
      return server.connectionJSON(false);
    });

    res.send({ connections: innerData });
  });
})

.all('/', function(req, res, next) {
  var err = new Error('Connections are a read-only resource.');
  err.status = 403;
  next(err);
});

router.get('/:id', function(req, res, next) {
  //server ID is always identical to connection ID
  Server.get(req.params.id)

  .then(function(server) {
    res.send(server.connectionJSON());
  });
})

.all('/:id', function(req, res, next) {
  var err = new Error('Connections are a read-only resource.');
  err.status = 403;
  next(err);
});

module.exports = router;
