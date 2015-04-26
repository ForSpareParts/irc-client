var http = require('http');

var emitter = require('../emitter');
var listener = require('../connection/listener');
var Message = require('../models/message');
var Server = require('../models/server');
var settings = require('../settings');
var socketLib = require('../socket');
var socketIOClient = require('socket.io-client');
var callAfterAllEvents = require('../utils').callAfterAllEvents;

var server;
var client;

//We need to set up:
//- A new HTTP server (for socket.io to use)
//- The socket instance itself
//- The listeners in the listener module, so that we can receive messages
//- A socket.io client
//
//we *don't* need listenToIRC, because we're just going to send the message
//by hand from the emitter
//
//When we're done, of course, we have to tear down everything we used

var io;

describe.only('The socket.io connection', function() {
  before(function() {
    server = http.createServer();
    server.listen(4000);

    io = require('socket.io')(server);
    socketLib.setupSocket(io);
  });

  beforeEach(function(done) {
    client = socketIOClient.connect('http://localhost:4000', {
      multiplex: false
    });

    client.on('connect', function() {
      done();
    });
  });

  afterEach(function() {
    client.disconnect();
  });

  after(function() {
    server.close();
    socketLib.clearSocket();
  });

  it('should notify the client when a new message arrives', function(done) {
    client.on('message', function(data) {
      assert.strictEqual(data.message.nick, 'newMsgNick');
      assert.strictEqual(data.message.contents, 'is the socket working?');
      assert.strictEqual(data.message.channel, 1);

      done();
    });

    emitter.emit('messageLogged', Message.forge({
      channel_id: 1,
      contents: 'is the socket working?',
      nick: 'newMsgNick',
      time: new Date().toISOString(),
      type: ''
    }));
  });

  it('should notify the client when the list of nicks for a channel is updated',
    function(done) {
      client.on('nicks', function(data) {
        assert.strictEqual(data.nickList.channel, 1);
        assert.deepEqual(data.nickList.nicks, ['somenick', 'othernick']);
        done();
      });

      emitter.emit('nicksLogged', {
        nickList: {
          id: 1,
          channel: 1,
          nicks: ['somenick', 'othernick']
        }
      });
  });
  
  it('should notify the client when someone joins a channel', function(done) {
    client.on('joined', function(data) {
      assert.strictEqual(data.message.nick, 'joinNick');
      assert.strictEqual(data.message.channel, 1);
      assert.strictEqual(data.message.contents, '');
      assert.strictEqual(data.message.type, 'join');
      done();
    });

    emitter.emit('joinedLogged', Message.forge({
      channel_id: 1,
      contents: '',
      nick: 'joinNick',
      time: new Date().toISOString(),
      type: 'join'
    }));
  });

  it('should notify the client when someone parts a channel', function(done) {
    client.on('parted', function(data) {
      assert.strictEqual(data.message.nick, 'partNick');
      assert.strictEqual(data.message.channel, 1);
      assert.strictEqual(data.message.contents, 'Reason for leaving.');
      assert.strictEqual(data.message.type, 'part');
      done();
    });

    emitter.emit('partedLogged', Message.forge({
      channel_id: 1,
      contents: 'Reason for leaving.',
      nick: 'partNick',
      time: new Date().toISOString(),
      type: 'part'
    }));
  });

  //TODO: this currently relies on socket/commadns accessing the nicks directly.
  //should refactor to request them from the connection via an event
  it('should resend the nick list upon request', function(done) {
    emitter.on('nicksRequested', function(channelID) {
      assert.strictEqual(channelID, 1);
      done();
    });

    client.emit('refreshNicks', 1);
  });

  it('should ask the backend to connect to a server', function(done) {
    emitter.on('connectRequested', function(serverID) {
      assert.strictEqual(serverID, 1);
      done();
    });

    client.emit('connectServer', 1);
  });

  it('should ask the backend to disconnect from a server', function(done) {
    emitter.on('disconnectRequested', function(serverID) {
      assert.strictEqual(serverID, 1);
      done();
    });

    client.emit('disconnectServer', 1);
  });

  it('should ask the backend to join a channel', function(done) {
    emitter.on('joinRequested', function(serverID, channelNameOrID) {
      assert.strictEqual(channelNameOrID, '#joinchannel');
      assert.strictEqual(serverID, 1);
      done();
    });

    client.emit('joinChannel', 1, '#joinchannel');
  });

  it('should ask the backend to part a channel', function(done) {
    emitter.on('partRequested', function(channelID) {
      assert.strictEqual(channelID, 1);
      done();
    });

    client.emit('partChannel', 1);
  });

  it('should ask the backend to send a message', function(done) {
    emitter.on('messageRequested', function(channelID, contents) {
      assert.strictEqual(channelID, 2);
      assert.strictEqual(contents, 'some message');
      done();
    });

    client.emit('message', 2, 'some message');
  });
});
