/**
 * Mock of the node-irc library implementing all functionality used by our app.
 *
 * Like the actual library, acts as an EventEmitter. Wherever possible/sensible,
 * emits the same events as node-irc.
 *
 * Available events:
 *
 * - 'registered' (successfully connected)
 */
var EventEmitter = require('events').EventEmitter;


var Client = function(server, nick, opt) {
  this.server = server;
  this.nick = nick;

  this.opt = {
    autoConnect: true
  };

  //code to merge opt into this.opt, from node-irc itself:
  if (typeof opt == 'object') {
      var keys = Object.keys(this.opt);
      for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          if (opt[k] !== undefined)
              this.opt[k] = opt[k];
      }
  }

  if (this.opt.autoConnect) {
    this.connect();
  }

};

//make client inherit from EventEmitter
Client.prototype.__proto__ = EventEmitter.prototype;

/**
 * Pretend to connect to the IRC server.
 * @param  {number}   retryCount
 * @param  {Function} callback
 */
Client.prototype.connect = function(retryCount, callback) {
  //you can pass callback as the only argument instead
  if (!callback && typeof retryCount == 'function') {
    callback = retryCount;
  }

  if (callback) {
    this.once('registered', callback);
  }

  this.emit('registered', 'Registration message from server: ' + this.server);
};

/**
 * Pretend to disconnect from the server.
 * @param  {string}   message
 * @param  {Function} callback
 */
Client.prototype.disconnect = function(message, callback) {
  if (!callback && typeof message == 'function') {
    callback = message;
  }

  if (callback) {
    this.once('quit', callback);
  }

  this.emit('quit',
    this.nick,
    'Quit reason for server: ' + this.server,
    [],
    {});
}

/**
 * Pretend to join a channel.
 * @param  {string}   channel
 * @param  {Function} callback
 */
Client.prototype.join = function(channel, callback) {
  this.once('join#' + channel, callback);

  this.emit('join', channel, this.nick, {});
  this.emit('join#' + channel, this.nick, {});
};

/**
 * Pretend to send a message to the target (either a nick or joined channel).
 * @param  {string} target
 * @param  {string} message
 */
Client.prototype.say = function(target, message) {
  return;
};

module.exports = {
  Client: Client
};