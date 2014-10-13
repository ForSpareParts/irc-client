var Promise = require('bluebird');

var modelsCommon = require('./common');

var BaseModel = modelsCommon.BaseModel;
var Bookshelf = modelsCommon.Bookshelf;

/** Represents an IRC channel or direct-message conversation. */
var Channel = BaseModel.extend({
  tableName: 'channel',

  //name (string)

 /** The Server on which this Channel exists. */
  server: function() {
    return this.belongsTo('Server');
  },

  /** All Users currently in this Channel. */
  users: function () {
    return this.belongsToMany('User');
  },
  
  /** All Messages sent in this Channel. */
  messages: function() {
    return this.hasMany('Message');
  },

  /**
   * Promise-enabled method to join this Channel using the irc Client. Does not
   * updated 'joined'.
   * @return {Promise}
   */
  _join: function() {
    var self = this;

    return new Promise(function(resolve, reject) {
      self.client().join(self.get('name'), function(joinInfo) {
        resolve(joinInfo);
      });
    });
  },

  /**
   * Promise-enabled method to part this Channel using the irc Client. Does not
   * update 'joined'.
   * @return {Promise}
   */
  _part: function() {
    var self = this;

    return new Promise(function(resolve, reject) {
      self.client().part(self.get('name'), function(partInfo) {
        resolve(partInfo);
      });
    });
  },

  /**
   * Proxy of this.get('joined') for readability.
   * @return {boolean}
   */
  _wantsToBeJoined: function() {
    return this.get('joined');
  },

  /**
   * Proxy of this.set('joined') for readability.
   */
  _setWantsToBeJoined: function(value) {
    return this.set('joined', value);
  },

  /**
   * Wipes out the 'joined' property and attribute so that we can safely send
   * this object back to the database.
   */
  _clearWantsToBeJoined: function() {
    delete this.joined;
    delete this.attributes.joined;
  },

  /**
   * Returns whether we need to join or part the channel -- i.e., whether
   * 'joined' (what we want) is out of sync with .isJoined() (what we currently
   * have).
   * @return {boolean}
   */
  _needsJoinOrPart: function() {
    return this._wantsToBeJoined() !== undefined &&
      this._wantsToBeJoined() !== this.isJoined();
  },

  /**
   * If we've cached whether we're really in the channel, return whether the
   * cache still matches the real state. Otherwise, return true.
   * @return {boolean}
   */
  _isJoinedCachedValid: function() {
    if (this._isJoinedCached !== undefined) {
      return this._isJoinedCached === this.isJoined();
    }

    return true;
  },

  isJoined: function() {
    var client = this.client();

    if (client && client.chans) {
      return client.chans.hasOwnProperty(this.get('name'));
    }

    return false;
  },

  /**
   * Populate this Channel from the database. Always eager-load the server
   * property.
   * @param  {Object} options
   * @return {Promise}
   */
  fetch: function(options) {
    var self = this;
    this._clearWantsToBeJoined();

    return Bookshelf.Model.prototype.fetch.apply(this, arguments)

    .then(function(fetched) {
      return fetched.related('server').fetch();
    })

    .then(function(fetchedServer) {
      var server = self.related('server');

      if (server) {
        self._setWantsToBeJoined(self.isJoined());
        self._isJoinedCached = self._wantsToBeJoined();        
      }

      return self;
    })
  },

  /**
   * Save the Channel. If it's new or the 'joined' property has changed, join or
   * part as appropriate. If the join/part attempt fails, throw an error and do
   * not persist the model.
   * @param  {Object} params
   * @param  {Object} options
   * @return {Promise}
   */
  save: function(params, options) {
    var self = this;
    var saveArguments = arguments;

    if (params && params.joined !== undefined) {
      this._setWantsToBeJoined(params.joined);
      delete params.joined;
    }

    return this.related('server').fetch()

    .then(function() {
      if (!self._isJoinedCachedValid()) {
        //as with Server#save, we check that our cahce is up-to-date
        var err = new Error("Channel was joined or parted unexpectedly");
        err.channel = self;
        throw err;
      }

      if (!self.related('server').isConnected() && self.get('joined')) {
        //we can't join (or be joined) if the server isn't connected
        var err = new Error("Cannot join channel while server is disconnected");
        err.channel = self;
        throw err;
      }

      //check our desired join/part state against the current real join/part
      //state
      if (self._needsJoinOrPart()) {
        if (self._wantsToBeJoined()) {
          return self._join();
        }

        return self._part();
      }

      //if we don't need to join or part the channel, we can just return a
      //resolve and skip on to the next step
      return Promise.resolve();
    })

    .then(function() {
      //strip off the 'joined' property before we move on to the base save()
      self._clearWantsToBeJoined();
      return Bookshelf.Model.prototype.save.apply(self, saveArguments);
    })

    .then(function(saved) {
      self._isJoinedCached = self.isJoined();
      self._setWantsToBeJoined(self.isJoined());

      return self;
    });

  },



  /**
   * Proxy to retrieve the irc.Client instance for this Channel's Server. Return
   * null if the Server is not already loaded/defined.
   * @return {irc.Client}
   */
  client: function() {
    var server = this.related('server');

    if (server) {
      return server.client();
    }

    return null;
  }
});

module.exports = Channel;
