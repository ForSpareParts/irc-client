var Promise = require('bluebird');

var modelsCommon = require('./common');
var irc = require('../node-irc');

var BaseModel = modelsCommon.BaseModel;
var Bookshelf = modelsCommon.Bookshelf;

/** Represents an IRC server. */
var Server = BaseModel.extend({
  tableName: 'server',

  //name (string)
  //host (string)
  //port (string)
  //connected (boolean)

  //unqiue together: host, port

  /** All known Channels on the Server. */
  channels: function() {
    return this.hasMany('Channel');
  },

  /** The User representing 'us' on the server. */
  connectionUser: function() {
    return this.belongsTo('User', 'connection_user_id');
  },

  /** All known Users on the server. */
  users: function() {
    return this.hasMany('User');
  },

  /**
   * Promise-enabled wrapper for the connect() method of this.client. Does *not*
   * change the value of connected
   * @return {Promise}
   */
  _connect: function() {
    //TODO: find a way to add proper error-handling.
    var self = this;

    return new Promise(function(resolve, reject) {
      console.log('ping');

      //just call connect...
      self.client.connect(function(connectInfo) {
        console.log('ping');

        //...and resolve in the callback
        resolve(connectInfo);
      });
    });
  },

  /**
   * Save the Server. If the server is new or the connected property has changed
   * to true, attempt to connect the server. If the connection fails, throw an
   * error and do not persist the model.
   * @return {Promise}
   */
  save: function(params, options) {
    if (this.changed.connected) {
      var self = this;
      var saveArguments = arguments;
      return this._connect()

      .then(function(connectInfo) {
        return Bookshelf.Model.prototype.save.apply(self, saveArguments);
      })

      .catch(function(error) {
        lastError = error;
      });
    }
  }

}, {
  clientCache: {},

  /**
   * Return an instance of irc.Client for the given host and port. Allows us to
   * cache client instances so that we don't inadvertantly connect twice.
   * @param  {string} host
   * @param  {string} port
   * @return {irc.Client}
   */
  getClient: function(host, port) {
    var hostString = host + ':' + port;

    //the existing client, if any
    var cached = this.clientCache[hostString];

    if (cached) {
      return cached;
    }

    //there's no cached client, create one:
    var created = new irc.Client(host, 'placeholderNick', {
      port: port,
      autoConnect: false
    });

    this.clientCache[hostString] = created;

    return created;
  },

  /**
   * Create a new Server. Creates an instance of irc.Client to manage the
   * connection. Will connect if connected == true, as per Server#save.
   * @param  {Object} initialData
   * @return {Promise}
   */
  create: function(initialData) {
    var server = Server.forge(initialData);
    server.client = Server.getClient(
      server.get('host'),
      server.get('port'));

    return server.save()
  }
});

module.exports = Server;
