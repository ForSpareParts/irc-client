var express = require('express');

module.exports.modelRestRouter = function(model) {
  var router = express.Router();

  router.route('/')
    .get(function(req, res) {
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
    })

    .post(function(req, res) {
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
    });

  //grab the model instance and store it in req.record so that we have it when
  //we get to the next step
  router.use('/:id', function(req, res, next) {
    model.get(req.params.id)

    .then(function(record) {
      req.record = record;
      next();
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
  });

  router.route('/:id')

    .get(function(req, res) {
      res.send(req.record.toEmber());
    })

    .put(function(req, res) {
      //delete any id in the request body -- otherwise, it could override the id
      //in the path
      tableName = model.tableName();
      delete req.body[tableName].id;

      //use the request body to overwrite the contents of the fetched model
      req.record.set(req.body[tableName]);

      return req.record.save()

      .then(function(updated) {
        res.send(updated.toEmber());
      });
    })

    .delete(function(req, res) {
      return req.record.destroy()

      .then(function() {
        res.send(
          {success: true}
        );
      });
    });

  return router;
};
