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
  io = ioInstance;

  io.on('connection', function(socket) {
    var joined = function(message) {
      socket.emit('joined', message.toEmber());
    };
    var parted = function(message) {
      socket.emit('parted', message.toEmber());
    };
    var messageHandler = function(message) {
      socket.emit('message', message.toEmber());
    };
    var nicks = function(nickListJSON) {
      socket.emit('nicks', nickListJSON);
    };

    emitter.on('joinedLogged', joined);
    emitter.on('partedLogged', parted);
    emitter.on('messageLogged', messageHandler);
    emitter.on('nicksLogged', nicks);

    socket.on('refreshNicks', commands.refreshNicks.bind(null, socket));
    socket.on('connectServer', commands.connectServer.bind(null, socket));
    socket.on('disconnectServer', commands.disconnectServer.bind(null, socket));
    socket.on('joinChannel', commands.joinChannel.bind(null, socket));
    socket.on('partChannel', commands.partChannel.bind(null, socket));
    socket.on('message', commands.message.bind(null, socket));


    socket.on('disconnect', function() {
      socket.removeAllListeners();
      emitter.removeListener('joinedLogged', joined);
      emitter.removeListener('partedLogged', parted);
      emitter.removeListener('messageLogged', messageHandler);
      emitter.removeListener('nicksLogged', nicks);
    });

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
