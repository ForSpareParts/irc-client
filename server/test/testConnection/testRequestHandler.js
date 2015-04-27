var emitter = require('../../emitter');

var Server = require('../../models/server');
var requestHandler = require('../../connection/request-handler');

var serverConn;

describe('The connection module\'s request handler', function() {

  beforeEach(function() {
    requestHandler.subscribe();

    return Server.get(1)
    .then(function(server) {
      serverConn = server.connection();
      return serverConn.connect();
    });
  });

  it('should connect to a server', function(done) {
    emitter.on('connected', function(connection) {
      assert.strictEqual(connection.host, 'irc.foo.net');
      done();
    });

    serverConn.disconnect()

    .then(function() {
      emitter.emit('connectRequested', 1);
    });
  });

  it('should disconnect from a server', function(done) {
    emitter.on('disconnected', function(connection) {
      assert.strictEqual(connection.host, 'irc.foo.net');
      done();
    });

    emitter.emit('disconnectRequested', 1);    
  });

  it('should join a channel by id', function(done) {
    emitter.on('joined', function(connection, channel, nick) {
      assert.strictEqual(channel, '#somechannel');
      assert.strictEqual(nick, 'myUserNick');
      done();
    });

    emitter.emit('joinRequested', 1);
  });

  it('should join a channel by name', function(done) {
    emitter.on('joined', function(connection, channel, nick) {
      assert.strictEqual(channel, '#somenewchannel');
      assert.strictEqual(nick, 'myUserNick');
      done();
    });

    emitter.emit('joinRequested', '#somenewchannel', 1);
  });

  it('should part a channel', function(done) {
    emitter.on('parted', function(connection, channel, nick, reason) {
      assert.strictEqual(channel, '#somechannel');
      assert.strictEqual(nick, 'myUserNick');
      done();
    });

    serverConn.join('#somechannel')

    .then(function() {
      emitter.emit('partRequested', 1);
    });
  });

  it('should retrieve the current nicks for a channel', function(done) {
    //the 'nicks' event is reserved for new nicks arriving from the server, so
    //we skip straight to a 'nicksLogged' event here
    emitter.on('nicksLogged', function(nickListJSON) {
      assert.strictEqual(nickListJSON.nickList.channel, 1);
      assert.deepEqual(
        nickListJSON.nickList.nicks,
        ['myUserNick', 'otheruser']);
      done();
    });


    serverConn.nicksInChannel['#somechannel'] = {
      'myUserNick': '',
      'otheruser': ''
    };

    emitter.emit('nicksRequested', 1);
  });

  it('should send a message to a channel', function(done) {
    emitter.on('message', function(connection, nick, channel, contents) {
      assert.strictEqual(channel, '#somechannel');
      assert.strictEqual(nick, 'myUserNick');
      assert.strictEqual(contents, 'message contents');
      done();
    });

    emitter.emit('messageRequested', 1, 'message contents');
  });
});
