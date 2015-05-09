import Ember from 'ember';

export default Ember.Route.extend({
  socket: Ember.inject.service('socket'),

  init: function() {
    this._super();

    this.get('socket').on('connected', this.updateConnection.bind(this));
    this.get('socket').on('disconnected', this.updateConnection.bind(this));
    this.get('socket').on('joined', this.updateJoinedChannel.bind(this));
  },

  model: function() {
    var store = this.get('store');

    //preload servers, connections, and channels into the store
    //NOTE: this is inefficient -- it would be better to implement a query on
    //the server for joined channels
    return store.find('server')

    .then(function() {
      return store.find('connection');
    })

    .then(function() {
      return store.find('channel');      
    })

    .then(function(channels) {
      return channels.filterBy('joined', true);
    });
  },

  updateConnection: function(connectionPayload) {
    this.get('store').push('connection', connectionPayload.connection);
  },

  updateJoinedChannel: function(joinedJSON) {
    var channel;
    var server;

    return this.store.find('channel', joinedJSON.message.channel)

    .then((fetched) => {
      channel = fetched;
      return channel.get('server');
    })

    .then((fetched) => {
      server = fetched;
      if (server.get('nick') === joinedJSON.message.nick) {
        //we're the one who joined this channel
        return server.get('connection')

        .then((connection) => {
          var joined = connection.get('joined');
          if (joined.indexOf(channel.get('name')) === -1) {
            joined.addObject(channel.get('name'));
            this.send('refreshJoined');
            this.transitionTo('channel', channel);
          }
        });
      }
    });
  },

  updatePartedChannel: function(partedJSON) {
    var channel;
    var server;

    return this.store.find('channel', partedJSON.message.channel)

    .then((fetched) => {
      channel = fetched;
      return channel.get('server');
    })

    .then((fetched) => {
      server = fetched;
      if (server.get('nick') === partedJSON.message.nick) {
        //we're the one who parted this channel
        return server.get('connection')

        .then((connection) => {
          var joined = connection.get('joined');
          var channelIndex = joined.indexOf(channel.get('name'));
          if (channelIndex !== -1) {
            joined.removeObject(channel.get('name'));
            this.send('refreshJoined');
          }
        });
      }
    });
  },

  actions: {
    makeServer: function(serversEditComponent) {
      var server = this.get('store').createRecord('server');
      
      //this is the component that raised the action
      //when we're done creating the instance, we need to tell the component to
      //set it as the "active" server for editing
      serversEditComponent.set('activeServer', server);
    },

    saveServer: function(server) {
      return server.save();
    },

    /**
     * Refreshes the ApplicationRoute model, which is a filtered list of joined
     * channels.
     */
    refreshJoined: function() {
      this.refresh();
    },

    connect: function(server) {
      this.get('socket').emit('connectServer', server.get('id'));
    },

    disconnect: function(server) {
      this.get('socket').emit('disconnectServer', server.get('id'));
    },

    /**
     * Signals the server to join `channel`, which can be a channel name or a
     * Channel object. If `channel` is a name, `serverID` must be passed as
     * well to determine the server on which to join `channel`.
     */
    join: function(channel, serverID) {
      if (typeof(channel) === 'object') {
        this.get('socket').emit('joinChannel', channel.get('id'));
      }
      else {
        this.get('socket').emit('joinChannel', channel, serverID);
      }
    },

    /**
     * Signals the server to part `channel` (which should be a channel object).
     */
    part: function(channel) {
      this.get('socket').emit('partChannel', channel.get('id'));
    }

  }
});
