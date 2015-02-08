var http = require('http');

var connectionEmitter = require('../connection').connectionEmitter;
var listener = require('../listener');
var Server = require('../models/server');
var settings = require('../settings');
var socketLib = require('../socket');

var server;
var client;

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

    Server.get(1)
    .then(function(server) {
      var serverConn = server.connection();
      connectionEmitter.emit('message', serverConn, 'testSocketNick',
        '#somechannel', 'is the socket working?', {});
    });
  });
});
