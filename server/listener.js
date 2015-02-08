/**
 * Listens for and responds to events from IRC servers. Responsible for logging
 * conversations to the database.
 */

var events = require('events');

var connectionEmitter = require('./connection').connectionEmitter;

var Channel = require('./models/channel');
var Server = require('./models/server');

/**
 * Emitter that triggers whenever one of the listener handlers is finished
 * (including any asynchronous processing the listener might have kicked off).
 *
 * Yes, this is a little silly -- but my tests need to know when these functions
 * have finished doing their jobs, and since I can't retrieve their return
 * values, I can't use promises like I normally would.
 * 
 * @type {events.EventEmitter}
 */
var listenerEmitter = new events.EventEmitter();
module.exports.listenerEmitter = listenerEmitter;

var joined = function(host, port, nick, channel) {
  //ensure a channel model exists  
  return Server.get({host:host, port:port, nick:nick})

  .then(function(server) {
    return Channel.getOrCreate({
      server_id: server.get('id'),
      name: channel
    });
  })

  .then(function() {
    listenerEmitter.emit('joinedFinished');
  });
};

var ircErrors = [];
module.exports.ircErrors = ircErrors;
var error = function(message) {
  ircErrors.push(message);
  listenerEmitter.emit('errorFinished');
};


module.exports.setupListeners = function() {
  connectionEmitter.on('joined', joined);
  connectionEmitter.on('error', error);
};

module.exports.clearListeners = function() {
  connectionEmitter.removeAllListeners();
  listenerEmitter.removeAllListeners();
};
