/**
 * Test the Server model.
 */

var sinon = require('sinon');

var irc = require('../../node-irc')
  , models = require('../../models');

var Server = models.Server;

//load mocha integration for sinon
require('mocha-sinon');

beforeEach(function() {
  //clear the Server class' cache of irc Clients
  Server.clientCache = {}
});

describe('The Server model', function() {
  it('should not connect to the server if {connected: false}',
    function() {
      var callback = sinon.spy();

      //we have to create the Client object beforehand so we can register
      //calls to it
      var client = new irc.Client(
        'irc.somedummyserver.net', 'placeholderNick', {
          port: 6667,
          autoConnect: false
        });
      Server.clientCache['irc.somedummyserver.net:6667'] = client;
      client.on('registered', callback);

      return Server.create({
        name: 'Don\'t Connect',
        host: 'irc.somedummyserver.net',
        port: 6667,
        connected: false})

      .then(function(server) {
        assert(!callback.called, 'server has not connected');
      });
    });

    it('should connect to the server if {connected: true}',
    function() {
      var callback = sinon.spy();

      //we have to create the Client object beforehand so we can register
      //calls to it
      var client = new irc.Client(
        'irc.somedummyserver.net', 'placeholderNick', {
          port: 6667,
          autoConnect: false
        });
      Server.clientCache['irc.somedummyserver.net:6667'] = client;
      client.on('registered', callback);

      return Server.create({
        name: 'Do Connect',
        host: 'irc.somedummyserver.net',
        port: 6667,
        connected: true})

      .then(function(server) {
        assert(callback.called, 'server has connected');
      });
    });
});
