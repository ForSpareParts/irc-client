var connectionLib = require('../connection');
var listener = require('../listener');
var settings = require('../settings');

var Channel = require('../models/channel');
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

  it('should ensure the database has a Channel for any joined IRC channel',
    function(done) {
      var connection = serverInstance.connection();

      listenerEmitter.on('joinedFinished', function() {
        //this will error out if the channel doesn't exist
        Channel.get({name: '#randomchannel'})
        .then(function() {
          done();
        });
      });

      connection.connect()
      .then(function() {
        return connection.join('#randomchannel');
      });
  });

  it('should trap and log errors from the IRC server', function(done) {
    var connection = serverInstance.connection();

    listenerEmitter.on('errorFinished', function() {
      assert.strictEqual(listener.ircErrors[0], 'test error message');
      done();
    });

    connection.client.emit('error', 'test error message');
  });


});