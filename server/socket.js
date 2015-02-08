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

var io;

module.exports.setupSocket = function(ioInstance) {
  //received new message from IRC server
  io = ioInstance;

  io.on('message', function(socket, message) {
    socket.emit('message', message.toEmber());
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

