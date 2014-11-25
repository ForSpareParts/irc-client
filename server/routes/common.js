var express = require('express');

module.exports.modelRestRouter = function(model) {
  var router = express.Router();

  router.route('/')
    .get(function(req, res, next) {
      return router.getCollection().fetch()

      .then(function (records) {
        //records is a Bookshelf collection, .models is the actual array of
        //records
        res.send(
          model.toEmberArray(records.models));
      })

      .catch(function(error) {
        next(error);
      });
    })

    .post(function(req, res, next) {
      tableName = model.forge().tableName;
      router.getCollection().create(req.body[tableName])

      .then(function(created) {
        res.send(created.toEmber());
      })

      .catch(function(error) {
        next(error);
      });
    });

  //grab the model instance and store it in req[model.tableName()] so that we
  //have it when we get to the next step
  router.use('/:id', function(req, res, next) {
    router.getCollection().query(function(qb) {
      qb.where({id: req.params.id});
    }).fetchOne()

    .then(function(record) {
      if (record === null) {
        var error = new Error("No record found in table " + model.tableName() +
          " for id " + req.params.id);
        error.status = 404;

        next(error);
      }

      else {
        req[model.tableName()] = record;
        
        next();        
      }
    })

    .catch(function(error) {
      next(error);
    })

    .catch(model.NotFoundError, function(error) {
      next(error);
    })

  });

  router.route('/:id')

    .get(function(req, res) {
      res.send(req[model.tableName()].toEmber());
    })

    .put(function(req, res) {
      //delete any id in the request body -- otherwise, it could override the id
      //in the path
      tableName = model.tableName();
      delete req.body[tableName].id;

      //use the request body to overwrite the contents of the fetched model
      req[model.tableName()].set(req.body[tableName]);

      return req[model.tableName()].save()

      .then(function(updated) {
        res.send(updated.toEmber());
      });
    })

    .delete(function(req, res) {
      return req[model.tableName()].destroy()

      .then(function() {
        res.send(
          {success: true}
        );
      });
    });


  /**
   * Gets all the records available to this route. This is the data for the root
   * path.
   *
   * By default, retrieves all records in model.
   * 
   * @return {Promise}
   */
  router.getCollection = function() {
    return model.collection();
  };

  return router;
};
