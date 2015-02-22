var connectionLib = require('../../connection');
var listener = require('../../connection/listener');
var settings = require('../../settings');

var Channel = require('../../models/channel');
var Message = require('../../models/message');
var Server = require('../../models/server');

var listenerEmitter = listener.listenerEmitter;
var serverInstance = null;
var connection = null;

var cacheListenSetting;

describe('The IRC listener module', function() {
  before(function() {
    cacheListenSetting = settings.listenToIRC;
    settings.listenToIRC = true;
  });

  beforeEach(function() {
    listener.setupListeners();
    return Server.get(1)
    .then(function(fetched) {
      serverInstance = fetched;
      connection = serverInstance.connection();
    });
  });

  afterEach(function() {
    listener.clearListeners();
  });

  after(function() {
    settings.listenToIRC = cacheListenSetting;
  });

  it('should trap and log errors from the IRC server', function(done) {
    listenerEmitter.on('errorFinished', function() {
      assert.include(listener.ircErrors[0], 'test error message');
      done();
    });

    connection.client.emit('error', { command:'test error message' });
  });

  it('should record messages from the IRC server', function(done) {
    listenerEmitter.on('messageFinished', function() {
      Message.get({
        channel_id: 1,
        nick: 'testListenerNick'
      })

      .then(function(message) {
        assert.strictEqual(message.get('contents'), 'can you hear me?');
        done();
      });
    });

    connection.client.emit('message', 'testListenerNick', '#somechannel',
      'can you hear me?', {});
  });

  it('should rewrite the nick list for a channel (on \'names\')',
    function(done) {
      listenerEmitter.on('nicksFinished', function() {
        assert.deepEqual(connection.nicksInChannel['#somechannel'],
          ['somenick', 'othernick']);
        done();
      });

      connection.client.emit('names', '#somechannel', {
        'somenick': '',
        'othernick': ''
      });
  });

});