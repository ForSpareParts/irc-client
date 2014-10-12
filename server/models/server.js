var Promise = require('bluebird');

var modelsCommon = require('./common');
var irc = require('../node-irc');

var BaseModel = modelsCommon.BaseModel;
var Bookshelf = modelsCommon.Bookshelf;

/**
Represents an IRC server.

In addition to its standard, database-derived properties, the Server class
exposes a 'connected' property, which indicates whether we are currently
connected to this server. 'connected' can be set() as other database properties
-- the actual connection or disconnection attempt occurs on save(). If an
attempt to connect or disconnect fails, the save() promise will be rejected and
the model will not be updated.
*/
var Server = BaseModel.extend({
  tableName: 'server',

  //name (string)
  //host (string)
  //port (string)

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
   * Promise-enabled wrapper for the connect() method of this.client().
   * @return {Promise}
   */
  _connect: function() {
    //TODO: find a way to add proper error-handling.
    var self = this;

    return new Promise(function(resolve, reject) {

      //just call connect...
      self.client().connect(function(connectInfo) {

        //...and resolve in the callback
        resolve(connectInfo);
      });
    });
  },

  /**
   * Promise-enabled wrapper for the disconnect() method of this.client().
   * @return {Promise}
   */
  _disconnect: function() {
    var self = this;

    return new Promise(function(resolve, reject) {
      self.client().disconnect(function(disconnectInfo) {
        resolve(disconnectInfo);
      });
    });
  },

  /**
   * If we've cached the state of the server's connection, return whether the
   * cache still matches the real state. Otherwise, return true.
   * @return {boolean}
   */
  _isConnectedCachedValid: function() {
    if (this._isConnectedCached !== undefined) {
      return this._isConnectedCached === this.isConnected();
    }

    return true;
  },

  /**
   * Proxy of this.get('connected') for readability.
   * @return {boolean}
   */
  _wantsToBeConnected: function() {
    return this.get('connected');
  },

  /**
   * Proxy of this.set('connected') for readability.
   */
  _setWantsToBeConnected: function(value) {
    return this.set('connected', value);
  },

  /**
   * Wipes out the 'connected' property and attribute so that we can safely send
   * this object back to the database.
   */
  _clearWantsToBeConnected: function() {
    delete this.connected;
    delete this.attributes.connected;
  },

  /**
   * Returns whether we need to change our connection to the server -- i.e.,
   * whether 'connected' (what we want) is out of sync with .isConnected() (what
   * we currently have).
   * @return {boolean}
   */
  _needsConnectOrDisconnect: function() {
    return this._wantsToBeConnected() !== undefined &&
          this._wantsToBeConnected() !== this.isConnected();
  },

  /**
   * Populate the Server with information from the database. Before resolving,
   * add a 'connected' property with the current value of this.isConnected().
   * @param  {Object} options
   * @return {Promise}
   */
  fetch: function(options) {
    //you can't actually fetch with connected in there. it'll crash. it sucks.
    //(this is because connected is NOT actually a database field)
    this._clearWantsToBeConnected();

    return Bookshelf.Model.prototype.fetch.apply(this, arguments)

    .then(function(fetched) {
      if (fetched) {
        fetched.set('connected', fetched.isConnected());

        //Used to make sure that the connection hasn't changed without our
        //knowledge (see Server#save).
        fetched._isConnectedCached = fetched.get('connected');

        return fetched;
      }
    });
  },

  /**
   * Save the Server. If the server is new or the connected property has changed
   * to true, attempt to connect the server. If the connection fails, throw an
   * error and do not persist the model.
   * @return {Promise}
   */
  save: function(params, options) {
    var self = this;
    var saveArguments = arguments;

    //we have to take 'connected' out of params and put it on the model itself,
    //or it'll get passed on to Bookshelf's save()
    if (params && params.connected !== undefined) {
      this._setWantsToBeConnected(params.connected);
      delete params.connected;
    }

    if (!this._isConnectedCachedValid()) {
      //the Server's in an invalid state -- don't save it
      var err = new Error(
        "Server experienced an unexpected connection or disconnection");
      err.server = this;
      return Promise.reject(err);
    }

    //check our desired connection state against the current connection state
    if (this._needsConnectOrDisconnect()) {
      var connectionPromise = null;
      var wantsToBeConnected = this._wantsToBeConnected();

      this._clearWantsToBeConnected();

      if (wantsToBeConnected){
        connectionPromise = this._connect();
      }
      else {
        connectionPromise = this._disconnect();
      }

      return connectionPromise

      .then(function(connectInfo) {
        return Bookshelf.Model.prototype.save.apply(self, saveArguments);
      })

      .then(function(saved) {
        self._isConnectedCached = self.isConnected();
        self._setWantsToBeConnected(self.isConnected());

        return self;
      });
    }

    //strip off the 'connected' property before we move on to the base save()
    this._clearWantsToBeConnected();

    return Bookshelf.Model.prototype.save.apply(self, saveArguments)

    .then(function(saved) {
      self._isConnectedCached = self.isConnected();
      self._setWantsToBeConnected(self.isConnected());

      return self;
    });
  },

  /**
   * Return the instance of irc.Client that represents this Server.
   * @return {irc.Client}
   */
  client: function() {
    return Server.getClient(
      this.get('host'),
      this.get('port'));
  },

  /**
   * Return whether we're currently connected to this server. Not exposed
   * directly via the irc library, so we have to infer it based on other
   * properties.
   * @return {boolean}
   */
  isConnected: function() {
    var client = this.client();


    var isConnected = (
      client.conn &&
      client.conn.readable &&
      client.conn.writable &&
      (
        client.conn.requestedDisconnect === null ||
        !client.conn.requestedDisconnect
      )
    );

    //coerce to a boolean
    if (isConnected) {
      return true;
    }

    return false;
  },

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
   * Fetch a collection of all Servers. Performs connection caching as in
   * Server#fetch().
   * @param  {Object} options
   * @return {Promise}
   */
  all: function() {
    return BaseModel.all.apply(this, arguments)

    .then(function(fetchedCollection) {
      fetchedCollection.each(function(server) {
        server.set('connected', server.isConnected());
        server._isConnectedCached = server.connected;
      });

      return fetchedCollection;
    });

  }
});

module.exports = Server;
