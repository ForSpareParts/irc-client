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
    .post(function(req, res, next) {
      var canCreate = router.canCreate(req);
      if (canCreate !== true) {
        next(canCreate);
      }

      else {
        return router.createRecord(req, res, next);        
      }
    });

  //grab the model instance and store it in req[model.tableName()] so that we
  //have it when we get to the next step
  router.use('/:id', lazyRoute('fetchSingleRecord'));

  router.route('/:id')
    .get(lazyRoute('getSingleRecord'))
    .put(function(req, res, next) {
      var canEdit = router.canEdit(req);
      if (canEdit !== true) {
        next(canEdit);
      }

      else {
        return router.updateSingleRecord(req, res, next);        
      }
    })
    .delete(function(req, res, next) {
      var canDelete = router.canDelete(req);
      if (canDelete !== true) {
        next(canDelete);
      }

      else {
        return router.deleteSingleRecord(req, res, next);
      }
    });


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
   * Filters the collection of records (for the list route) according to params
   * on the query object. Returns the filtered collection.
   */
  router.filterCollection = function(query, collection) {
    return collection;
  };


  /**
   * Get and serve all records for this route.
   */
  router.getAll = function(req, res, next) {
    var collection = router.getCollection(req);
    collection = this.filterCollection(req.query, collection);

    return collection.fetch()

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

    //NOTE: there's nothing here to prevent you from creating a record that
    //would NOT appear in the route's Collection
    model.fromEmber(req.body).save()

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

  router.updateSingleRecord = function(req, res, next) {
    tableName = model.tableName();
    delete req.body[tableName].id;

    var updateRecord = model.fromEmber(req.body);
    
    //use the request body to overwrite the contents of the fetched model
    req[model.tableName()].set(updateRecord.attributes);

    return req[model.tableName()].save()

    .then(function(updated) {
      res.send(updated.toEmber());
    });
  };

  router.deleteSingleRecord = function(req, res, next) {
    return req[model.tableName()].destroy()

    .then(function() {
      res.send(
        {success: true}
      );
    });
  };

  /**
   * If we are allowed to edit this record, return true. Otherwise, return an
   * error object indicating the reason we can't edit the record.
   *
   * By default, always returns true.
   * 
   * @param  {Request} req the current request
   */
  router.canEdit = function(req) {
    return true;
  };

  /**
   * If we are allowed to delete this record, return true. Otherwise, return an
   * error object indicating the reason we can't delete the record.
   *
   * By default, returns this.canEdit(req).
   * 
   * @param  {Request} req the current request
   */
  router.canDelete = function(req) {
    return this.canEdit(req);
  };

  /**
   * If we are allowed to create a record at this path, return true. Otherwise,
   * return an error object indicating the reason we can't create a record.
   * 
   * @param  {Request} req the current request
   */
  router.canCreate = function(req) {
    return true;
  };

  return router;
};
