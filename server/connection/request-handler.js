/**
 * Reacts to client requests by finding an appropriate Connection object and
 * triggering an action.
 */

var emitter = require('../emitter');
var Channel = require('../models/channel');
var Server = require('../models/server');

var connectRequested = function(serverID) {
  Server.get(serverID)

  .then(function(server) {
    server.connection().connect();
  });
};

var disconnectRequested = function(serverID) {
  Server.get(serverID)

  .then(function(server) {
    server.connection().disconnect();
  });
};

var joinRequested = function(channelNameOrID, serverID) {
  if (serverID !== undefined) {
    Server.get(serverID)

    .then(function(server) {
      server.connection().join(channelNameOrID);
    });
  }
  else {
    var channel;
    Channel.get(channelNameOrID)

    .then(function(fetched) {
      channel = fetched;
      return channel.connection();
    })

    .then(function(connection) {
      connection.join(channel.get('name'));
    });
  }
};

var partRequested = function(channelID) {
  var channel;
  Channel.get(channelID)

  .then(function(fetched) {
    channel = fetched;
    return channel.connection();
  })

  .then(function(connection) {
    connection.part(channel.get('name'));
  });
};

var nicksRequested = function(channelID) {
  var channel;
  Channel.get(channelID)

  .then(function(fetched) {
    channel = fetched;
    return channel.connection();
  })

  .then(function(connection) {
    emitter.emit('nicksLogged', connection.nickListJSON(channel));
  });
};

//this is a request to say something in a channel
var messageRequested = function(channelID, contents) {
  var channel;
  Channel.get(channelID)

  .then(function(fetched) {
    channel = fetched;
    return channel.connection();
  })

  .then(function(connection) {
    connection.say(channel.get('name'), contents);
  });
};

module.exports.subscribe = function() {
  emitter.on('connectRequested', connectRequested);
  emitter.on('disconnectRequested', disconnectRequested);
  emitter.on('joinRequested', joinRequested);
  emitter.on('partRequested', partRequested);
  emitter.on('nicksRequested', nicksRequested);
  emitter.on('messageRequested', messageRequested);
};

module.exports.unsubscribe = function() {
  emitter.removeListener('connectRequested', connectRequested);
  emitter.removeListener('disconnectRequested', disconnectRequested);
  emitter.removeListener('joinRequested', joinRequested);
  emitter.removeListener('partRequested', partRequested);
  emitter.removeListener('nicksRequested', nicksRequested);
  emitter.removeListener('messageRequested', messageRequested);
};
