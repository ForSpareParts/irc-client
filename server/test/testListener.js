var connectionLib = require('../connection');

var Channel = require('../models/channel');
var Server = require('../models/server');

var listenerEmitter = null;
var serverInstance = null;


describe('The IRC listener module', function() {
  before(function() {
    listenerEmitter = require('../listener').listenerEmitter;
  });

  beforeEach(function() {
    connectionLib.clearConnections();
    return Server.get(1)
    .then(function(fetched) {
      serverInstance = fetched;
    })
  });

  afterEach(function() {
    listenerEmitter.removeAllListeners();
  });

  // it('should ensure the database has a Server for any active connection',
  //   function(done) {
  //     var connection = connectionLib.getConnection(
  //       'irc.somenewserver.net', '6667', 'SomeNewNick');

  //     listenerEmitter.on('connectedFinished', function() {
  //       //this will error out if the server doesn't exist
  //       Server.get({
  //         host: 'irc.somenewserver.net',
  //         port: '6667',
  //         nick: 'SomeNewNick'
  //       })
  //       .then(function() {
  //         done();
  //       });
  //     });

  //     connection.connect()
  // });

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
});