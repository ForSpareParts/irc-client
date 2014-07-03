var express = require('express');
var router = express.Router();

var Server = require('../models').Server;

var getAll = function(req, res) {
  var promise = Server.all();

  promise.then(function (servers) {
    res.send(servers);
  })
};

var getId = function(req, res) {
  var promise = Server.find(req.params.id);

  promise.then(function(server) {
    res.send(server);
  })
};

var create = function(req, res) {
  var promise = Server.create({
    name: req.body.name,
    host: req.body.host,
    port: req.body.port
  });

  promise.then(function(created) {
    res.send(created);
  });
};

var update = function(req, res) {
  var promise = Server.find(req.params.id);

  promise.then(function(server) {

    return server.updateAttributes({
      name: req.body.name,
      host: req.body.host,
      port: req.body.port
    });

  }).then(function(server) {

    res.send(server);

  });
};

var destroy = function(req, res) {
  var promise = Server.find(req.params.id);

  promise.then(function(server) {
    return server.destroy();
  }).then(function() {
    res.send(
      {success: true}
    );
  });
};

router.get('/', getAll);
router.post('/', create);

router.get('/:id', getId);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
