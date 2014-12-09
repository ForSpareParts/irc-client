/**
 * Test the Channel model.
 */

var sinon = require('sinon');

var Channel = require('../../models/channel');

var channel = null;
var connection = null;
var server = null;

describe('The Channel model', function() {
  beforeEach(function() {
    return Channel.get(1)

    .then(function(fetchedChannel) {
      channel = fetchedChannel;

      return channel.related('server').fetch();
    })

    .then(function(fetchedServer) {
      server = fetchedServer;
      connection = server.connection();
    });
  });

  it('should refuse to speak in a channel when disconnected', function() {
    return assert.isRejected(channel.say("some message"), /offline/);
  });

  it('should refuse to speak in a channel that is not joined', function() {
    return connection.connect()
    .then(function() {
      return assert.isRejected(channel.say("some message"),
        /without joining channel/);
    });
  });

  it('should send a message in a joined channel', function() {
    var callback = sinon.spy();
    connection.client.on('join'+ channel.get('name'), callback);

    return connection.connect()
    .then(function() {
      return connection.join(channel.get('name'));
    })

    .then(function() {
      return channel.say('Speaking from the channel model.');
    })

    .then(function() {
      assert.isTrue(callback.called);
    })
  });
})