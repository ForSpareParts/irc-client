var http = require('http');

var connectionEmitter = require('../connection').connectionEmitter;
var listener = require('../connection/listener');
var Server = require('../models/server');
var settings = require('../settings');
var socketLib = require('../socket');

var server;
var client;

var serverConn;

//We need to set up:
//- A new HTTP server (for socket.io to use)
//- The socket instance itself
//- The listeners in the listener module, so that we can receive messages
//- A socket.io client
//
//we *don't* need listenToIRC, because we're just going to send the message
//by hand from the connectionEmitter
//
//When we're done, of course, we have to tear down everything we used

describe('The socket.io connection', function() {
  before(function() {
    server = http.createServer();
    server.listen(4000);

    var io = require('socket.io')(server);
    socketLib.setupSocket(io);

    listener.setupListeners();

    client = require('socket.io-client')('http://localhost:4000');
  });

  beforeEach(function() {
    return Server.get(1)
    .then(function(server) {
      serverConn = server.connection();
    });
  });

  afterEach(function() {
    client.removeAllListeners();
  });

  after(function() {
    server.close();

    socketLib.clearSocket();

    listener.clearListeners();

    client.disconnect();
  });

  it('should notify the client when a new message arrives', function(done) {
    client.on('message', function(data) {
      assert.strictEqual(data.message.nick, 'testSocketNick');
      assert.strictEqual(data.message.contents, 'is the socket working?');
      assert.strictEqual(data.message.channel, 1);

      done();
    });

    connectionEmitter.emit('message', serverConn, 'testSocketNick',
      '#somechannel', 'is the socket working?', {});
  });

  it('should notify the client when the list of nicks for a channel is updated',
    function(done) {
      client.on('nicks', function(data) {
        assert.strictEqual(data.nickList.channel, 1);
        assert.deepEqual(data.nickList.nicks, ['somenick', 'othernick']);
        done();
      });

      connectionEmitter.emit('nicks', serverConn, '#somechannel',
        {somenick: '', othernick:''});
    });

  it('should notify the client when someone joins a channel', function(done) {
    client.on('joined', function(data) {
      assert.strictEqual(data.message.nick, 'joinNick');
      assert.strictEqual(data.message.channel, 1);
      assert.strictEqual(data.message.contents, '');
      assert.strictEqual(data.message.type, 'join');
      done();
    });

    connectionEmitter.emit('joined', serverConn, '#somechannel', 'joinNick');
  });

  it('should notify the client when someone parts a channel', function(done) {
    client.on('parted', function(data) {
      assert.strictEqual(data.message.nick, 'partNick');
      assert.strictEqual(data.message.channel, 1);
      assert.strictEqual(data.message.contents, 'Reason for leaving.');
      assert.strictEqual(data.message.type, 'part');
      done();
    });

    connectionEmitter.emit('parted', serverConn, '#somechannel', 'partNick',
      'Reason for leaving.');
  });

  it('should resend the nick list when asked', function(done) {
    client.on('nicks', function(data) {
      assert.strictEqual(data.nickList.channel, 1);
      assert.deepEqual(data.nickList.nicks, ['resendNick']);
      done();
    });

    serverConn.nicksInChannel['#somechannel'] = {resendNick: ''};
    client.emit('refreshNicks', 1);
  });
});
