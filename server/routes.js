var express = require('express');

var models = require('./models');

var modelRestRouter = function(model) {
  var router = express.Router();

  var getAll = function(req, res) {
    var promise = model.all();

    promise.then(function (servers) {
      res.send(servers);
    })
  };

  var getId = function(req, res) {
    var promise = model.find(req.params.id);

    promise.then(function(server) {
      res.send(server);
    })
  };

  var create = function(req, res) {
    var promise = model.create(req.body);

    promise.then(function(created) {
      res.send(created);
    });
  };

  var update = function(req, res) {
    var promise = model.find(req.params.id);

    promise.then(function(server) {

      return server.updateAttributes(req.body);

    }).then(function(server) {

      res.send(server);

    });
  };

  var destroy = function(req, res) {
    var promise = model.find(req.params.id);

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

  return router;
};

module.exports.Server = modelRestRouter(models.Server);
module.exports.Channel = modelRestRouter(models.Channel);
module.exports.User = modelRestRouter(models.User);
module.exports.Message = modelRestRouter(models.Message);
