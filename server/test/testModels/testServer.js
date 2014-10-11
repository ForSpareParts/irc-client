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

var createDisconnectedServer = function() {
  return Server.create({
    name: sampleData.name,
    host: sampleData.host,
    port: sampleData.port,
    connected: false});
}

var createConnectedServer = function() {
  return Server.create({
    name: sampleData.name,
    host: sampleData.host,
    port: sampleData.port,
    connected: true});
}

beforeEach(function() {
  //clear the Server class' cache of irc Clients
  Server.clientCache = {}
});

describe('The Server model', function() {
  it('should not connect to the server on creation if {connected: false}',
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

      return createDisconnectedServer()

      .then(function(server) {
        assert(!callback.called, 'server did not connect');
      });
    });

    it('should connect to the server on creation if {connected: true}',
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

      return createConnectedServer()

      .then(function(server) {
        assert(callback.called, 'server connected');
      });
    });

    it('should connect on save if requested', function() {
      //i.e., if we pass {connected: true} and we're not already connected

      var callback = sinon.spy();

      return createDisconnectedServer()

      .then(function(server) {
        var client = server.client()
        client.on('registered', callback);
        return server.save({connected: true});
      })

      .then(function(server) {
        assert(callback.called, 'server connected');
      });
    });

    it('should disconnect on save if requested', function() {
      //i.e., if we pass {connected: true} and we're not already connected

      var callback = sinon.spy();

      return createConnectedServer()

      .then(function(server) {
        var client = server.client()
        client.on('quit', callback);
        return server.save({connected: false});
      })

      .then(function(server) {
        assert(callback.called, 'server disconnected');
      });
    });

    it('should prevent us from saving a server if its connection status '
        + 'changes unexpectedly', function() {
      var server = null;
      return createConnectedServer()

      .then(function(created) {
        server = created;

        //disconnect without updating the model
        return server._disconnect();
      })

      .then(function() {
        return assert.isRejected(server.save());
      });
    });

    it('should populate connection state after a .fetch()', function() {
      return createConnectedServer()

      .then(function(created) {
        freshServer = Server.forge({name: sampleData.name});
        return freshServer.fetch();
      })

      .then(function(fetched) {
        assert(freshServer.get('connected'), 'connection state was fetched');
      });
    });
});
