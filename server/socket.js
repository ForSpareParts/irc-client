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
var emitter = require('./emitter');
var Channel = require('./models/channel');
var Server = require('./models/server');

var io;

module.exports.setupSocket = function(ioInstance) {
  //received new message from IRC server
  io = ioInstance;

  io.on('connection', function(socket) {

    emitter.on('joinedFinished', function(message) {
      socket.emit('joined', message.toEmber());
    });

    emitter.on('partedFinished', function(message) {
      socket.emit('parted', message.toEmber());
    });

    emitter.on('messageFinished', function(message) {
      socket.emit('message', message.toEmber());
    });

    emitter.on('nicksFinished', function(nickListJSON) {
      socket.emit('nicks', nickListJSON);
    });

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

    socket.on('connectServer', function(serverID) {
      var server;
      return Server.get(serverID)

      .then(function(fetched) {
        server = fetched;
        return server.connection().connect();
      })

      .then(function() {
        socket.emit('connected', server.connectionJSON())
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
