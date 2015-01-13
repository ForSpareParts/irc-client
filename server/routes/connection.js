var Promise = require('bluebird');
var express = require('express');

var connection = require('../connection');
var models = require('../models');


var router = express.Router();

//we can access the connection's Server at req.server

var serverConnectionJSON = function(server){
  var connection = server.connection();
  return {
    connection : {
      id: server.id,
      connected: connection.isConnected(),
      server: server.id,
      joined: connection.getJoinedChannels()
    }
  };
};

/**
 * Send a quick summary of the connection.
 */
router.route('/')
  .get(function(req, res) {
    res.send(serverConnectionJSON(req.server));
  })

  .put(function(req, res) {
    var promise = Promise.resolve(null);

    var updated = req.body.connection;
    var connection = req.server.connection();

    //only update the connection if something has changed
    if (updated.connected !== undefined) {
      promise.then(function() {
        return connection.setConnected(updated.connected);
      });
    }

    if (updated.joined !== undefined) {
      promise.then(function() {
        return connection.setJoinedChannels(updated.joined);
      });
    }

    promise.then(function() {
      res.send(serverConnectionJSON(req.server));
    });
  })

  .all(function(req, res) {
    res.status(405).send({
      message: 'Connection model only accepts GET and PUT.'});
  });

// router.route('/connected')
//   /** Get connection state. */
//   .get(function(req, res) {
//     res.send({
//       connected: req.server.connection().isConnected()
//     });
//   })

//   /** Update connection state (connect/disconnect). */
//   .post(function(req, res) {
//     if (req.body.connected === true) {
//       req.server.connection().connect().then(function() {
//         res.send({connected: true});
//       });
//     }

//     else if (req.body.connected === false) {
//       req.server.connection().disconnect().then(function() {
//         res.send({connected: false});
//       });
//     }
//   });


// router.route('/joined')

//   .get(function(req, res) {
//     res.send({
//       joined: req.server.connection().getJoinedChannels()});
//   })

//   .post(function(req, res) {
//     req.server.connection().setJoinedChannels(req.body.joined);

//     res.send({
//       joined: req.server.connection().getJoinedChannels()});
//   })

//   .put(function(req, res) {
//     req.server.connection().addJoinedChannels(req.body.joined);

//     res.send({
//       joined: req.server.connection().getJoinedChannels()});
//   });

module.exports = router;
