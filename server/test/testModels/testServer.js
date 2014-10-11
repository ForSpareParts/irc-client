/**
 * Test the Server model.
 */

var sinon = require('sinon');

var irc = require('../../node-irc')
  , models = require('../../models');

var Server = models.Server;

//load mocha integration for sinon
require('mocha-sinon');

describe('The Server model', function() {
  it('should connect a new record to the server only if {connected: true}',
    function() {
      callback = sinon.spy();

      //we have to create the Client object beforehand so we can register
      //calls to it
      var noConnectClient = new irc.Client(
        'irc.somedummyserver.net', 'placeholderNick', {
          port: 6667,
          autoConnect: false
        });
      Server.clientCache['irc.somedummyserver.net:6667'] = noConnectClient;
      noConnectClient.on('registered', callback);

      return Server.create({
        name: 'Don\'t Connect',
        host: 'irc.somedummyserver.net',
        port: 6667,
        connected: false})

      .then(function(noConnectServer) {
        //the above model should NOT result in a connection
        assert(!callback.called);
      });

    });
});
