/**
 * Socket handlers for command events sent from the client.
 *
 * These functions are bound to a socket in socket/index.js, after the socket
 * is connected.
 */
var emitter = require('../emitter');
var Channel = require('../models/channel');
var Server = require('../models/server');

module.exports.refreshNicks = function(socket, channelID) {
  emitter.emit('nicksRequested', channelID);
};

module.exports.connectServer = function(socket, serverID) {
  emitter.emit('connectRequested', serverID);
};

module.exports.disconnectServer = function(socket, serverID) {
  emitter.emit('disconnectRequested', serverID);
};

//serverID is optional -- you only need it if you use a channel name instead of
//an ID. we only do this because the client needs a way to request a join on an
//entirely new channel (one the backend has no record of yet)
module.exports.joinChannel = function(socket, channelNameOrID, serverID) {
  emitter.emit('joinRequested', channelNameOrID, serverID);
};

module.exports.partChannel = function(socket, channelID) {
  emitter.emit('partRequested', channelID);
};

module.exports.message = function(socket, channelID, contents) {
  emitter.emit('messageRequested', channelID, contents);
};
