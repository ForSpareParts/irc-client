//set our working directory to the server's root, making it easier to run the
//server from other directories/build scripts/etc.
process.chdir(__dirname);

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var models = require('./models');
var settings = require('./settings');

var app = express();

if (settings.listenToIRC) {
  require('./listener');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());

if (settings.logRequests) {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//'build' is a directory ignored by git -- ember-cli can put compiled files
//there, while 'public' is reserved for any static files specific to the server
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/servers', routes.Server);
app.use('/channels', routes.Channel);
app.use('/users', routes.User);
app.use('/messages', routes.Message);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
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
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
