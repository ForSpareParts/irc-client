/**
 * Listens for and responds to events from IRC servers. Responsible for logging
 * conversations to the database.
 */

var events = require('events');

var connectionEmitter = require('./index').connectionEmitter;
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

/**
 * Emitter that triggers whenever one of the listener handlers is finished
 * (including any asynchronous processing the listener might have kicked off).
 *
 * Yes, this is a little silly -- but my tests need to know when these functions
 * have finished doing their jobs, and since I can't retrieve their return
 * values, I can't use promises like I normally would.
 * 
 * @type {events.EventEmitter}
 */
var listenerEmitter = new events.EventEmitter();
module.exports.listenerEmitter = listenerEmitter;

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

  .then(function(partMessage) {
    if (connection.nicksInChannel[channelName] === undefined) {
      connection.nicksInChannel[channelName] = {};
    }

    connection.nicksInChannel[channelName][nick] = '';

    socketLib.emit('joined', partMessage.toEmber());
    listenerEmitter.emit('joinedFinished');
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

    socketLib.emit('parted', partMessage.toEmber());
    listenerEmitter.emit('partedFinished');
  });
};

var ircErrors = [];
module.exports.ircErrors = ircErrors;
var error = function(connection, message) {
  var hostString = (connection.nick + '@' + connection.host + ':' +
    connection.port);
  ircErrors.push(hostString + ': ' + message.command);
  console.log(hostString + ': ' + message.command);
  listenerEmitter.emit('errorFinished');
};


var message = function(connection, nick, to, text, message) {
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
    socketLib.emit('message', message.toEmber());
    listenerEmitter.emit('messageFinished');
  });
};

var nicks = function(connection, channelName, nicks) {
  //update the list
  connection.nicksInChannel[channelName] = nicks;

  return getChannel(connection, channelName)

  .then(function(channel) {
    //tell the socket to send out the new nicks
    socketLib.emit('nicks', connection.nickListJSON(channel));
    listenerEmitter.emit('nicksFinished');
  });
};

module.exports.setupListeners = function() {
  connectionEmitter.on('joined', joined);
  connectionEmitter.on('parted', parted);
  connectionEmitter.on('error', error);
  connectionEmitter.on('message', message);
  connectionEmitter.on('nicks', nicks);
};

module.exports.clearListeners = function() {
  connectionEmitter.removeAllListeners();
  listenerEmitter.removeAllListeners();
};
