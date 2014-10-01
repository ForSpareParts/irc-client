/**
 * Mock of the node-irc library implementing all functionality used by our app.
 */


var Client = function(server, nick, opt) {
  console.log('INIT');
  this.server = server;
  this.nick = nick;

  this.opt = {
    autoConnect: true
  };

  //code to merge opt into this.opt, from node-irc itself:
  if (typeof opt == 'object') {
      var keys = Object.keys(this.opt);
      for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          if (opt[k] !== undefined)
              this.opt[k] = opt[k];
      }
  }

  if (this.opt.autoConnect) {
    this.connect();
  }

};

/**
 * Pretend to connect to the IRC server.
 * @param  {number}   retryCount
 * @param  {Function} callback
 */
Client.prototype.connect = function(retryCount, callback) {
  callback();
};

/**
 * Pretend to join a channel.
 * @param  {string}   channel
 * @param  {Function} callback
 */
Client.prototype.join = function(channel, callback) {
  callback();
};

/**
 * Pretend to send a message to the target (either a nick or joined channel).
 * @param  {string} target
 * @param  {string} message
 */
Client.prototype.say = function(target, message) {
  return;
};

module.exports = {
  Client: Client
};