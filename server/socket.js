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
var Channel = require('./models/channel');


var io;

module.exports.setupSocket = function(ioInstance) {
  //received new message from IRC server
  io = ioInstance;

  io.on('connection', function(socket) {

    /** Send the current nick list for the given channel ID */
    socket.on('refreshNicks', function(channelID) {
      var channel;
      return Channel.get(channelID)
      .then(function(fetched) {
        channel = fetched;
        return channel.connection();
      })

      .then(function(connection) {
        socket.emit('nicks', connection.nickListJSON(channel));
      });
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
