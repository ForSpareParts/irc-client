/**
 * Test the Server model.
 */

var sinon = require('sinon');

var irc = require('../../node-irc')
  , models = require('../../models');

var Channel = models.Channel
  , Server = models.Server;

//load mocha integration for sinon
require('mocha-sinon');


var sampleData = {
  name: '#dummychannel',
  server_id: 1
}

var createPartedChannel = function() {
  return Channel.create({
    name: sampleData.name,
    server_id: sampleData.server_id,
    joined: false});
}

var createJoinedChannel = function() {
  return Channel.create({
    name: sampleData.name,
    server_id: sampleData.server_id,
    joined: true});
}

//cache the Server we use for test channels, for convenience
var parentServer = null;

describe('The Channel model', function() {
  beforeEach(function() {
    //clear the Server class' cache of irc Clients
    Server.clientCache = {}

    //connect the Server
    return Server.get(1)

    .then(function(fetched) {
      parentServer = fetched;
      return fetched.save({connected: true});
    });
  });

  it('should not join the channel on creation if {joined: false}',
    function() {
      var callback = sinon.spy();

      parentServer.client().on('join' + sampleData.name, callback);

      return createPartedChannel()

      .then(function(channel) {
        assert(!callback.called, 'channel was not joined');
      });
    });

  it('should join the channel on creation if {joined: true}',
    function() {
      var callback = sinon.spy();

      parentServer.client().on('join' + sampleData.name, callback);

      return createJoinedChannel()

      .then(function(channel) {
        assert(callback.called, 'channel was joined');
      });
    });

    it('should join on save if requested', function() {
      //i.e., if we pass {joined: true} and we're not already joined

      var callback = sinon.spy();

      return createPartedChannel()

      .then(function(channel) {
        channel.client().on('join' + channel.get('name'), callback);
        return channel.save({joined: true});
      })

      .then(function(server) {
        assert(callback.called, 'channel joined');
      });
    });

    it('should part on save if requested', function() {
      //i.e., if we pass {joined: false} and we're currently joined

      var callback = sinon.spy();

      return createJoinedChannel()

      .then(function(channel) {
        channel.client().on('part' + channel.get('name'), callback);
        return channel.save({joined: false});
      })

      .then(function(server) {
        assert(callback.called, 'channel parted');
      });
    });

    it('should prevent us from saving a channel if its joined status changes '
        + 'unexpectedly', function() {
      var channel = null;
      return createJoinedChannel()

      .then(function(created) {
        channel = created;

        //part without updating the model
        return channel._part();
      })

      .then(function() {
        return assert.isRejected(channel.save());
      });
    });

    it('should prevent us from saving a channel with {joined:true} if its '
      + 'server is currently disconnected', function() {
      var channel = null;
      return createJoinedChannel()

      .then(function(created) {
        channel = created;

        return channel.related('server').fetch();
      })

      .then(function(server) {
        //disconnect the server, leaving the original channel model alone
        return server._disconnect();        
      })

      .then(function() {
        return assert.isRejected(channel.save());
      });
    });

    it('should populate joined state after a .fetch()', function() {
      var freshChannel = null;
      return createJoinedChannel()

      .then(function(created) {
        freshChannel = Channel.forge({name: sampleData.name});
        return freshChannel.fetch();
      })

      .then(function(fetched) {
        assert(freshChannel.get('joined'), 'connection state was fetched');
      });
    });
});
