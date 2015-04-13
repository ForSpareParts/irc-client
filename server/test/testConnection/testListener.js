var emitter = require('../../emitter');
var connectionLib = require('../../connection');
var listener = require('../../connection/listener');
var settings = require('../../settings');

var Channel = require('../../models/channel');
var Message = require('../../models/message');
var Server = require('../../models/server');

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
    emitter.removeAllListeners();
  });

  after(function() {
    settings.listenToIRC = cacheListenSetting;
  });

  it('should trap and log errors from the IRC server', function(done) {
    emitter.on('errorFinished', function() {
      assert.include(listener.ircErrors[0], 'test error message');
      done();
    });

    connection.client.emit('error', { command:'test error message' });
  });

  it('should record messages from the IRC server', function(done) {
    emitter.on('messageFinished', function() {
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
      emitter.on('nicksFinished', function() {
        assert.deepEqual(connection.nicksInChannel['#somechannel'],
          {
            somenick: '',
            othernick: ''
          });
        done();
      });

      connection.client.emit('names', '#somechannel', {
        'somenick': '',
        'othernick': ''
      });
  });

  it('should add a nick to the list when it joins a channel', function(done) {
    emitter.on('joinedFinished', function() {
      assert.property(connection.nicksInChannel['#somechannel'], 'aNewNick');
      done();
    });

    //we haven't handled any events on this channel yet, so #somechannel
    //won't have a nicklist
    assert.isUndefined(connection.nicksInChannel['#somechannel']);
    connection.client.emit('join', '#somechannel', 'aNewNick', {});
  });

  it('should remove a nick from the list when it parts a channel',
    function(done) {
      emitter.on('partedFinished', function() {
        assert.notProperty(connection.nicksInChannel['#somechannel'],
          'somenick');
        done();
      });

      //fake an earlier 'join' by putting somenick in the nicklist for the
      //channel
      connection.nicksInChannel['#somechannel'] = {somenick: ''};
      connection.client.emit('part', '#somechannel', 'somenick',
        'reason for leaving', {});
  });

});