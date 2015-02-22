var express = require('express');

var Channel = require('../models/server');


var singleRouter = express.Router();

//get the joined list for the channel with the same ID
singleRouter.get('/:id', function(req, res) {
  Channel.get(req.params.id)

  .then(function(channel) {
    req.channel = channel;

    return req.channel.related('server').fetch();
  })

  .then(function(server) {
    req.server = server;
    var connection = server.connection();

    
  });
});


module.exports.singleRouter = singleRouter;