/**
 * Logs IRC events to the database.
 */

var emitter = require('../emitter');

var socketLib = require('../socket');

var Channel = require('../models/channel');
var Message = require('../models/message');
var Server = require('../models/server');

var getServer = function(connection) {
  return Server.get({
    host: connection.host,
    port: connection.port,
    nick: connection.nick});
};

var getChannel = function(connection, channelName) {
  return getServer(connection)

  .then(function(server) {
    return Channel.getOrCreate({
      server_id: server.get('id'),
      name: channelName
    });
  });
};

var joined = function(connection, channelName, nick) {
  return getChannel(connection, channelName)

  .then(function(channel) {
    return Message.create({
      channel_id: channel.get('id'),
      contents: '',
      nick: nick,
      time: new Date().toISOString(),
      type: 'join'
    });
  })

  .then(function(joinMessage) {
    if (connection.nicksInChannel[channelName] === undefined) {
      connection.nicksInChannel[channelName] = {};
    }

    connection.nicksInChannel[channelName][nick] = '';
    emitter.emit('joinedLogged', joinMessage);
  });
};

var parted = function(connection, channelName, nick, reason) {
  return getChannel(connection, channelName)

  .then(function(channel) {
    return Message.create({
      channel_id: channel.get('id'),
      contents: reason,
      nick: nick,
      time: new Date().toISOString(),
      type: 'part'
    });
  })

  .then(function(partMessage) {
    if (connection.nicksInChannel[channelName] === undefined) {
      connection.nicksInChannel[channelName] = {};
    }

    delete connection.nicksInChannel[channelName][nick];
    emitter.emit('partedLogged', partMessage);
  });
};

var ircErrors = [];
module.exports.ircErrors = ircErrors;
var error = function(connection, message) {
  var hostString = (connection.nick + '@' + connection.host + ':' +
    connection.port);
  ircErrors.push(hostString + ': ' + message.command);
  console.log(hostString + ': ' + message.command);
  emitter.emit('errorLogged');
};


var message = function(connection, nick, to, text) {
  return getChannel(connection, to)

  .then(function(channel) {
    return Message.create({
      channel_id: channel.get('id'),
      contents: text,
      nick: nick,
      time: new Date().toISOString()
    });
  })

  .then(function(message) {
    emitter.emit('messageLogged', message);
  });
};

var nicks = function(connection, channelName, nicks) {
  //update the list
  connection.nicksInChannel[channelName] = nicks;

  return getChannel(connection, channelName)

  .then(function(channel) {
    emitter.emit('nicksLogged', connection.nickListJSON(channel));
  });
};

module.exports.subscribe = function() {
  emitter.on('joined', joined);
  emitter.on('parted', parted);
  emitter.on('error', error);
  emitter.on('message', message);
  emitter.on('nicks', nicks);
};

module.exports.unsubscribe = function() {
  emitter.removeListener('joined', joined);
  emitter.removeListener('parted', parted);
  emitter.removeListener('error', error);
  emitter.removeListener('message', message);
  emitter.removeListener('nicks', nicks);
};
