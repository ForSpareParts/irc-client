/**
 * Listens for and responds to events from IRC servers. Responsible for logging
 * conversations to the database.
 */

var events = require('events');

var connectionEmitter = require('./connection').connectionEmitter;
var socketLib = require('./socket');

var Channel = require('./models/channel');
var Message = require('./models/message');
var Server = require('./models/server');

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

var joined = function(connection, channel) {
  //ensure a channel model exists  
  return Server.get({
    host: connection.host,
    port: connection.port,
    nick: connection.nick})

  .then(function(server) {
    return Channel.getOrCreate({
      server_id: server.get('id'),
      name: channel
    });
  })

  .then(function() {
    listenerEmitter.emit('joinedFinished');
  });
};

var ircErrors = [];
module.exports.ircErrors = ircErrors;
var error = function(connection, message) {
  var hostString = (connection.nick + '@' + connection.host + ':' +
    connection.port);
  ircErrors.push(hostString + ': ' + message);
  listenerEmitter.emit('errorFinished');
};


var message = function(connection, nick, to, text, message) {
  return Server.get({
    host: connection.host,
    port: connection.port,
    nick: connection.nick})

  .then(function(server) {
    return Channel.get({
      server_id: server.get('id'),
      name: to
    });
  })

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


module.exports.setupListeners = function() {
  connectionEmitter.on('joined', joined);
  connectionEmitter.on('error', error);
  connectionEmitter.on('message', message);
};

module.exports.clearListeners = function() {
  connectionEmitter.removeAllListeners();
  listenerEmitter.removeAllListeners();
};
