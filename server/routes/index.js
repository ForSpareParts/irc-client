var express = require('express');

var models = require('../models');
var modelRestRouter = require('./common').modelRestRouter;

var apiRouter = express.Router();

apiRouter.use('/servers', require('./server'));
apiRouter.use('/channels', require('./channel'));
apiRouter.use('/messages', modelRestRouter(models.Message));

/// catch 404 and forward to error handler
apiRouter.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (apiRouter.get('env') === 'development' || apiRouter.get('env') === 'test') {
  apiRouter.use(function(err, req, res, next) {
    var errorContext = {
      message: err.message,
      error: err
    }

    res.status(err.status || 500);

    if (req.accepts('json') === 'json') {
      //if we can take a json object, send that and save some cycles
      res.send(errorContext);
    }
    else {
      //otherwise, render an actual error page
      res.render('error', errorContext);
    }
  });
}

// production error handler
// no stacktraces leaked to user
apiRouter.use(function(err, req, res, next) {
  res.status(err.status || 500);

  if (req.accepts('json') === 'json') {
    //if we can take a json object, send that and save some cycles
    res.send({
      message: err.message,
      error: {},
    });
  }
  else {
    //otherwise, render an actual error page
    res.render('error', {
      message: err.message,
      error: {}
    });
  }
});

module.exports = apiRouter;
