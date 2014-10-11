/**
 * This module acts as a proxy to either node-irc or the node-irc mock. To use
 * the mock, set settings.ircLib to 'mock' -- for the real library, set
 * 'node-irc'.
 *
 * For information about the mock library, see mock.js.
 */

var Promise = require('bluebird');

var settings = require('../settings');

var libs = {
  irc: require('irc'),
  mock: require('./mock')
}

module.exports = libs[settings.ircLib];
