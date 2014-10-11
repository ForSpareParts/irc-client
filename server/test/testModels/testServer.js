/**
 * Test the Server model.
 */

var sinon = require('sinon');

var irc = require('../../node-irc')
  , models = require('../../models');

var Server = models.Server;

//load mocha integration for sinon
require('mocha-sinon');


var sampleData = {
  name: 'An IRC Server',
  host: 'irc.somedummyserver.net',
  nick: 'placeholderNick',
  port: 6667
}


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
        sampleData.host, sampleData.nick, {
          port: sampleData.port,
          autoConnect: false
        });
      Server.clientCache[
        sampleData.host + ':' + sampleData.port] = client;
      client.on('registered', callback);

      return Server.create({
        name: sampleData.name,
        host: sampleData.host,
        port: sampleData.port,
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
        sampleData.host, sampleData.nick, {
          port: sampleData.port,
          autoConnect: false
        });
      Server.clientCache[
        sampleData.host + ':' + sampleData.port] = client;
      client.on('registered', callback);

      return Server.create({
        name: sampleData.name,
        host: sampleData.host,
        port: sampleData.port,
        connected: true})

      .then(function(server) {
        assert(callback.called, 'server has connected');
      });
    });
});
