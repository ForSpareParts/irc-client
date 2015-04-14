/**
 * Provides handlers for realtime socket events on the server.
 *
 * Other modules can use emit() as a proxy to the active socket, e.g.:
 *
 * var emit = require('./socket').emit;
 * emit('message', {...});
 *
 * This is simply a no-op if there's no active socket.
 */
var commands = require('./commands');
var emitter = require('../emitter');
var Channel = require('../models/channel');
var Server = require('../models/server');

var io;

module.exports.setupSocket = function(ioInstance) {
  //received new message from IRC server
  io = ioInstance;

  io.on('connection', function(socket) {

    emitter.on('joinedLogged', function(message) {
      socket.emit('joined', message.toEmber());
    });

    emitter.on('partedLogged', function(message) {
      socket.emit('parted', message.toEmber());
    });

    emitter.on('messageLogged', function(message) {
      socket.emit('message', message.toEmber());
    });

    emitter.on('nicksLogged', function(nickListJSON) {
      socket.emit('nicks', nickListJSON);
    });

    /** Send the current nick list for the given channel ID */
    socket.on('refreshNicks', commands.refreshNicks.bind(null, socket));
    socket.on('connectServer', commands.connectServer.bind(null, socket));
    socket.on('disconnectServer', commands.disconnectServer.bind(null, socket));
    socket.on('joinChannel', commands.joinChannel.bind(null, socket));
  });
};

module.exports.clearSocket = function() {
  io = undefined;
};

module.exports.emit = function() {
  if (io) {
    io.emit.apply(io, arguments);
  }
};
