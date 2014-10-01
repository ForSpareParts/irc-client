/**
 * This module acts as a proxy to either node-irc or the node-irc mock. To use
 * the mock, set settings.ircLib to 'mock' -- for the real library, set
 * 'node-irc'.
 *
 * For information about the mock library, see mock.js.
 */

var Promise = require('bluebird');

var settings = require('../settings');


if (settings.ircLib === 'mock') {
  module.exports = Promise.promisifyAll(
    require('./mock'));
}
else if (settings.ircLib === 'node-irc') {
  module.exports = Promise.promisifyAll(
    require('node-irc'));
}
