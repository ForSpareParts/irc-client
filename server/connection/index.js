/**
 * Provides an abstraction over an irc.Client instance. It has promise-based
 * versions of connect/disconnect, join/part, etc.
 *
 * Connection does *not* respond to "unexpected" events like new messages -- it
 * just exposes them as events through the emitter. See listener.js for event
 * handling.
 */

var Promise = require('bluebird');

var _ = require('underscore');

var argv = require('yargs').argv;

var emitter = require('../emitter');
var settings = require('../settings');
var irc = require(settings.ircLib);
var callAfterAllEvents = require('../utils').callAfterAllEvents;

var connectionCache = {};

var idCounter = 0;
/**
 * Return an instance of Connection for the given host, port, and nick. Allows
 * us to cache Connections so we don't accidentally connect twice.
 *
 * Connection instance is not necessarily active (connected) when returned.
 * 
 * @param  {string} host
 * @param  {string} port
 * @param {string} nick
 * @return {Connection}
 */
module.exports.getConnection = function(host, port, nick) {
  var hostString = nick + '@' + host + ':' + port;

  //the existing client, if any
  var cached = connectionCache[hostString];

  if (cached) {
    return cached;
  }

  //there's no cached client, create one:
  var created = new Connection(host, port, nick);

  connectionCache[hostString] = created;

  return created;
};

/**
 * Wipe the connection cache, effectively erasing all connections and leaving us
 * with a blank slate. Used in testing.
 */
module.exports.clearConnections = function() {
  for (var connection in connectionCache) {
    if (connection.client) {
      connection.client.removeAllListeners();
    }
  }

  connectionCache = {};

  idCounter = 0;
};

/**
 * Represents a connection to an IRC server. Creates an irc.Client object for
 * the connection if one doesn't already exist.
 * 
 * @param {string} host
 * @param {string} port
 * @param {string} nick
 */
var Connection = function(host, port, nick) {
  this.host = host;
  this.port = port;
  this.nick = nick;

  this.client = new irc.Client(this.host, this.nick, {
    port: this.port,
    autoConnect: false,
    debug: true,
  });

  //channel name -> list of nicks in channel
  this.nicksInChannel = {};

  this.id = idCounter;
  idCounter += 1;

  var self = this;

  this.client.on('join', function(channel, nick, message) {
    emitter.emit('joined', self, channel, nick);
  });

  this.client.on('part', function(channel, nick, reason, message) {
    emitter.emit('parted', self, channel, nick, reason);
  });

  this.client.on('names', function(channel, nicks) {
    emitter.emit('nicks', self, channel, nicks);
  });

  this.client.on('error', function(message) {
    emitter.emit('error', self, message);
  });

  this.client.on('message', function(nick, to, text, message) {
    emitter.emit('message', self, nick, to, text);
  });
};

/**
 * Promise-enabled wrapper for the connect() method of this.client.
 * @return {Promise}
 */
Connection.prototype.connect = function() {
  //TODO: find a way to add proper error-handling.
  var self = this;
  return new Promise(function(resolve, reject) {
    //just call connect...
    self.client.connect(function(connectInfo) {

      emitter.emit('connected', self);

      //...and resolve in the callback
      resolve(connectInfo);
    });
  });
};

/**
 * Promise-enabled wrapper for the disconnect() method of this.client.
 * @return {Promise}
 */
Connection.prototype.disconnect = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    self.client.disconnect(function(disconnectInfo) {

      emitter.emit('disconnected', self);
      resolve(disconnectInfo);
    });
  });
};


/**
 * Wraps both connect() and disconnect() to take a boolean. The resulting
 * Promise is a no-op if the Connection doesn't actually need to change its
 * state.
 * @param {boolean} shouldBeConnected
 * @return {Promise}
 */
Connection.prototype.setConnected = function(shouldBeConnected) {
  if (this.isConnected() === shouldBeConnected) {
    return Promise.resolve(null);
  }

  if (shouldBeConnected === true) {
    return this.connect();
  }
  else if (shouldBeConnected === false) {
    return this.disconnect();
  }

  return Promise.reject(new Error('invalid value for \'connected\''));
};

/**
 * Promise-enabled wrapper for the join() method of this.client. Promise
 * resolves only after we've joined *and* received the names in the channel.
 *
 * Waiting for the names makes testing easier (less need for event listeners),
 * and we'll nearly always need the names when joining, anyway.
 * @param  {string} channel
 * @return {Promise}
 */
Connection.prototype.join = function(channel) {
  var self = this;

  return new Promise(function(resolve, reject) {
    self.client.join(channel, function(joinInfo) {
      resolve(joinInfo);
    });
  });
};

/**
 * Promise-enabled wrapper for the part() method of this.client.
 * @param  {string} channel
 * @return {Promise}
 */
Connection.prototype.part = function(channel) {
  var self = this;

  return new Promise(function(resolve, reject) {
    self.client.part(channel, function(partInfo) {
      resolve(partInfo);
    });
  });
};

/**
 * Return whether we're currently connected to this server. Not exposed
 * directly via the irc library, so we have to infer it based on other
 * properties.
 * @return {boolean}
 */
Connection.prototype.isConnected = function() {
  var client = this.client;

  var isConnected = (
    client.conn &&
    client.conn.readable &&
    client.conn.writable &&
    (
      client.conn.requestedDisconnect === null ||
      !client.conn.requestedDisconnect
    )
  );

  //coerce to a boolean
  if (isConnected) {
    return true;
  }

  return false;
};

/**
 * Return an array of all the channels this connection is currently in.
 * @return {[String]} channel names
 */
Connection.prototype.getJoinedChannels = function() {
  return Object.keys(this.client.chans);
};

/**
 * Replace the entire set of joined channels with newChannels.
 *
 * If a currently joined channel is in newChannels, it will not be parted and
 * rejoined -- from the server's perspective, nothing will happen. Currently
 * joined channels that are *not* in newChannels will be parted.
 * 
 * @param {[string]} newChannels
 */
Connection.prototype.setJoinedChannels = function(newChannels) {
  var self = this;

  var channelsToJoin = [];
  var channelsToPart = [];

  newChannels.forEach(function(channel) {
    if (!(channel in self.client.chans)) {
      //we need to join this channel
      channelsToJoin.push(channel);
    }
  });

  this.getJoinedChannels().forEach(function(channel) {
    if (newChannels.indexOf(channel) === -1) {
      channelsToPart.push(channel);
    }
  });

  promises = [];

  channelsToJoin.forEach(function(channel) {
    promises.push(self.join(channel));
  });

  channelsToPart.forEach(function(channel) {
    promises.push(self.part(channel));
  });

  return Promise.all(promises);
};


/**
 * Join any channels in newChannels you are not already joined to.
 * 
 * @param {[string]} newChannels
 */
Connection.prototype.addJoinedChannels = function(newChannels) {
  var self = this;
  var channelsToJoin = [];

  newChannels.forEach(function(channel) {
    if (!(channel in self.client.chans)) {
      //we need to join this channel
      channelsToJoin.push(channel);
    }
  });

  promises = [];

  channelsToJoin.forEach(function(channel) {
    promises.push(self.join(channel));
  });

  return Promise.all(promises);
};

/**
 * Send messageContents to channel.
 */
Connection.prototype.say = function(channel, messageContents) {
  this.client.say(channel, messageContents);
  emitter.emit(
    'message', this, this.nick, channel, messageContents);
};

/**
 * Return an Ember-formatted NickList representing the nicks in the given
 * Channel.
 * 
 * @param  {Channel} channel
 */
Connection.prototype.nickListJSON = function(channel) {
  return {
    nickList: {
      id: channel.get('id'),
      channel: channel.get('id'),
      nicks: Object.getOwnPropertyNames(
        this.nicksInChannel[channel.get('name')])
    }
  };
};
