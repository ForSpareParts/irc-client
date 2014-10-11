var express = require('express');

var models = require('./models');

var modelRestRouter = function(model) {
  var router = express.Router();

  var getAll = function(req, res) {
    var promise = model.all();

    promise.then(function (records) {
      //records is a Bookshelf collection, .models is the actual array of
      //records
      res.send(
        model.toEmberArray(records.models));
    })

    .catch(function(error) {
      res.status(500).send({
        error: error
      });
    });
  };

  var getId = function(req, res) {
    model.get(req.params.id)

    .then(function(record) {
      res.send(record.toEmber());
    })

    .catch(model.NotFoundError, function(error) {
      res.status(404).send({
        error: error
      });
    })

    .catch(function(error) {
      res.status(500).send({
        error: error
      });
    });
  };

  var create = function(req, res) {
    tableName = model.forge().tableName;
    model.create(req.body[tableName])

    .then(function(created) {
      res.send(created.toEmber());
    })

    .catch(function(error) {
      res.status(500).send({
        error: error
      });
    });
  };

  var update = function(req, res) {
    //delete any id in the request body -- otherwise, it could override the id
    //in the path
    tableName = model.forge().tableName;
    delete req.body[tableName].id;

    var promise = new model({
      id: req.params.id
    }).save(req.body[tableName], {
      patch: true
    });

    promise.then(function(updated) {
      res.send(updated.toEmber());
    })

    .catch(model.NotFoundError, function(error) {
      res.status(404).send({
        error: error
      });
    })

    .catch(function(error) {
      res.status(500).send({
        error: error
      });
    });
  };

  var destroy = function(req, res) {
    //null out any id in the request body -- otherwise, it could override the id
    //in the path

    var promise = model.destroy(req.params.id);

    promise.then(function() {

      res.send(
        {success: true}
      );
    })

    .catch(model.NotFoundError, function(error) {
      res.status(404).send({
        error: error
      });
    })

    .catch(function(error) {
      res.status(500).send({
        error: error
      });
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
module.exports.Server.get('/:id/connected', function(req, res) {
  
});


module.exports.Channel = modelRestRouter(models.Channel);
module.exports.User = modelRestRouter(models.User);
module.exports.Message = modelRestRouter(models.Message);
