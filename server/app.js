//set our working directory to the server's root, making it easier to run the
//server from other directories/build scripts/etc.
process.chdir(__dirname);

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var apiRouter = require('./routes');
var devRouter = require('./test_utils').router;
var models = require('./models');
var settings = require('./settings');

var app = express();

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

app.use('/api', apiRouter);

if (settings.enableDevRoutes){
  app.use('/dev', devRouter);
}

app.use(function(req, res, next) {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'build/index.html'));
  }

  else {
    next();
  }
});

module.exports = app;
