/**
 * Socket handlers for command events sent from the client.
 *
 * These functions are bound to a socket in socket/index.js, after the socket
 * is connected.
 */

var Channel = require('../models/channel');
var Server = require('../models/server');

module.exports.refreshNicks = function(socket, channelID) {
  var channel;
  return Channel.get(channelID)
  .then(function(fetched) {
    channel = fetched;
    return channel.connection();
  })

  .then(function(connection) {
    socket.emit('nicks', connection.nickListJSON(channel));
  });
};

module.exports.connectServer = function(socket, serverID) {
  var server;
  return Server.get(serverID)

  .then(function(fetched) {
    server = fetched;
    return server.connection().connect();
  })

  .then(function() {
    socket.emit('connected', server.connectionJSON());
  });
};

module.exports.disconnectServer = function(socket, serverID) {
  var server;
  return Server.get(serverID)

  .then(function(fetched) {
    server = fetched;
    return server.connection().disconnect();
  })

  .then(function() {
    socket.emit('disconnected', server.connectionJSON())
  });
};

module.exports.joinChannel = function(socket, serverID, channelNameOrID) {
  var server;

  return Server.get(serverID)

  .then(function(fetched) {
    server = fetched;

    if (typeof(channelNameOrID) === 'string') {
      return channelNameOrID;
    }

    return Channel.get(channelNameOrID)

    .then(function(fetched) {
      return fetched.get('name');
    });

    //either way, the next promise will resolve to a channel name
  })

  .then(function(name) {
    return server.connection().join(name);
  });
};

module.exports.partChannel = function(socket, serverID, channelID) {
  var server;

  return Server.get(serverID)

  .then(function(fetched) {
    server = fetched;
    return Channel.get(channelID);
  })

  .then(function(channel) {
    return server.connection().part(channel.get('name'));
  });
};


module.exports.message = function(socket, serverID, channelID, contents) {
  var server;

  return Server.get(serverID)

  .then(function(fetched) {
    server = fetched;
    return Channel.get(channelID);
  })

  .then(function(channel) {
    return server.connection().say(channel.get('name'), contents);
  });
};
