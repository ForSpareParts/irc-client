var express = require('express');

module.exports.modelRestRouter = function(model) {
  var router = express.Router();

  /**
   * Creates a function that calls router[functionName] with req, res, next.
   * Useful so that we can override router functions after creating this route.
   * @return {function}
   */
  var lazyRoute = function(functionName) {
    return function(req, res, next) {
      router[functionName](req, res, next);
    };
  };

  router.route('/')
    .get(lazyRoute('getAll'))
    .post(lazyRoute('createRecord'));

  //grab the model instance and store it in req[model.tableName()] so that we
  //have it when we get to the next step
  router.use('/:id', lazyRoute('fetchSingleRecord'));

  router.route('/:id')
    .get(lazyRoute('getSingleRecord'))
    .put(lazyRoute('updateSingleRecord'))
    .delete(lazyRoute('deleteSingleRecord'));


  /**
   * Gets all the records available to this route as a collection. This is the
   * data for the root path, and allows us to filter other requests.
   *
   * By default, retrieves all records in model.
   *
   * @param  {[express.Request]} req
   * @param  {models.BaseModel} model
   * @return {Promise}
   */
  router.getCollection = function(req) {
    return model.collection();
  };


  /**
   * Get and serve all records for this route.
   */
  router.getAll = function(req, res, next) {
    return router.getCollection(req).fetch()

    .then(function (records) {
      //records is a Bookshelf collection, .models is the actual array of
      //records
      res.send(
        model.toEmberArray(records.models));
    })

    .catch(function(error) {
      next(error);
    });
  };

  router.createRecord = function(req, res, next) {
    tableName = model.forge().tableName;
    router.getCollection(req).create(req.body[tableName])

    .then(function(created) {
      res.send(created.toEmber());
    })

    .catch(function(error) {
      next(error);
    });
  };

  router.fetchSingleRecord = function(req, res, next) {
    router.getCollection(req).query(function(qb) {
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
    });
  };

  router.getSingleRecord = function(req, res) {
    res.send(req[model.tableName()].toEmber());
  };

  router.updateSingleRecord = function(req, res) {
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
  };

  router.deleteSingleRecord = function(req, res) {
    return req[model.tableName()].destroy()

    .then(function() {
      res.send(
        {success: true}
      );
    });
  };

  return router;
};
