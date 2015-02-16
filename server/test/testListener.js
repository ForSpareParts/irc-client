var connectionLib = require('../connection');
var listener = require('../listener');
var settings = require('../settings');

var Channel = require('../models/channel');
var Message = require('../models/message');
var Server = require('../models/server');

var listenerEmitter = listener.listenerEmitter;
var serverInstance = null;

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
    });
  });

  afterEach(function() {
    listener.clearListeners();
  });

  after(function() {
    settings.listenToIRC = cacheListenSetting;
  });

  it('should trap and log errors from the IRC server', function(done) {
    var connection = serverInstance.connection();

    listenerEmitter.on('errorFinished', function() {
      assert.include(listener.ircErrors[0], 'test error message');
      done();
    });

    connection.client.emit('error', { command:'test error message' });
  });

  it('should record messages from the IRC server', function(done) {
    var connection = serverInstance.connection();

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

});