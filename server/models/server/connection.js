var Promise = require('bluebird');

var _ = require('underscore');
var irc = require('../../node-irc');

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
  var created = new Connection(host, nick, port);

  connectionCache[hostString] = created;

  return created;
};

/**
 * Wipe the connection cache, effectively erasing all connections and leaving us
 * with a blank slate. Used in testing.
 */
module.exports.clearConnections = function() {
  connectionCache = {};
  idCounter = 0;
}

/**
 * Represents a connection to an IRC server. Creates an irc.Client object for
 * the connection if one doesn't already exist.
 * 
 * @param {string} host
 * @param {string} port
 * @param {string} nick
 */
var Connection = function(host, port, nick) {
  //there's no cached client, create one:
  this.client = new irc.Client(host, nick, {
    port: port,
    autoConnect: false
  });

  this.id = idCounter;
  idCounter += 1;
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
      resolve(disconnectInfo);
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
 * Return a list of all the channels this connection is currently in.
 * @return {[String]} channel names
 */
Connection.prototype.getCurrentChannels = function() {
  return Object.keys(this.client.chans);
};
