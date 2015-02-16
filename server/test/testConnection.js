var sinon = require('sinon');

var connectionLib = require('../connection');
var settings = require('../settings');

//a connection we'll create for each test
var connection = null;

//a sinon test spy we'll also create for each test
var callback = null;

var cacheListenSetting;

describe('The IRC connection module', function() {
  beforeEach(function() {
    //clear out all connection information between tests
    connectionLib.clearConnections();

    connection = connectionLib.getConnection(
      'irc.foobar.net', '6667', 'myNick');
    callback = sinon.spy();
  });

  it('should always get the same connection instance for the same server',
    function() {
      var first = connectionLib.getConnection(
        'someHost', 'somePort', 'someNick');
      var second = connectionLib.getConnection(
        'someHost', 'somePort', 'someNick');

      //the library should be smart enough to reuse the connection object it
      //made for the first call
      assert.strictEqual(first.id, second.id);
    });

  it('should connect to an IRC server', function() {
    connection.client.on('registered', callback);

    return connection.connect()

    .then(function() {
      assert.isTrue(callback.calledOnce);
    });
  });

  describe('once connected to a server', function() {
    beforeEach(function() {
      return connection.connect()
      .then(function() {
        return connection.setJoinedChannels(['#channelA', '#channelB']);
      });
    });

    it('should disconnect from an IRC server', function() {
      connection.client.on('quit', callback);

      return connection.disconnect()
      
      .then(function() {
        assert.isTrue(callback.calledOnce);
      });
    });

    it('should join and part a set of channels', function() {
      connection.client.on('join#channelC', callback);

      var secondCallback = sinon.spy();
      connection.client.on('join#channelB', secondCallback);

      return connection.setJoinedChannels(['#channelB', '#channelC'])

      .then(function() {
        //we should have joined #channelC, but not #channelB (because we were
        //already in #channelB)
        assert.isTrue(callback.calledOnce);
        assert.isTrue(secondCallback.notCalled);

        assert.deepEqual(connection.getJoinedChannels(),
          ['#channelB', '#channelC']);
      });
    });

    it('should join new channels', function() {
      connection.client.on('join#channelC', callback);

      var secondCallback = sinon.spy();
      connection.client.on('join#channelB', secondCallback);

      return connection.addJoinedChannels(['#channelB', '#channelC'])

      .then(function() {
        //we should have joined #channelC, but not #channelB (because we were
        //already in #channelB)
        assert.isTrue(callback.calledOnce);
        assert.isTrue(secondCallback.notCalled);

        //because we used addJoinedChannels, we should still be in #channelA
        assert.deepEqual(connection.getJoinedChannels(),
          ['#channelA', '#channelB', '#channelC']);
      });
    });
  });


  describe('The IRC connection module with listening enabled,', function() {

    before(function() {
      cacheListenSetting = settings.listenToIRC;
      settings.listenToIRC = true;
    });

    beforeEach(function() {
      //clear out all connection information between tests
      connectionLib.clearConnections();

      connection = connectionLib.getConnection(
        'irc.foobar.net', '6667', 'myNick');
      callback = sinon.spy();
    });

    after(function() {
      settings.listenToIRC = cacheListenSetting;
    });

    it('should populate a list of nicks for a joined channel', function(done) {
      connectionLib.connectionEmitter.on('nicks',
        function(connection, channel, nicks) {
          assert.strictEqual(nicks[0], 'nickA');
          assert.strictEqual(nicks[1], 'nickB');

          done();
        });

      connection.client.emit('names', '#testNicks', {
        'nickA': '',
        'nickB': ''
      });
    });
  });
});