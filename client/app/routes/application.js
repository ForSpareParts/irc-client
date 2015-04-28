import Ember from 'ember';

export default Ember.Route.extend({
  socket: Ember.inject.service('socket'),

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
      this.socket.emit('connect', server.get('id'));
    },

    disconnect: function(server) {
      this.socket.emit('disconnect', server.get('id'));
    },

    /**
     * Signals the server to join `channel`, which can be a channel name or a
     * Channel object.
     */
    join: function(channel) {
      if (typeof(channel) === 'object') {
        this.socket.emit('join', channel.get('id'));
      }
      else {
        this.socket.emit('join', channel);
      }
    },

    /**
     * Signals the server to part `channel`, which can be a channel name or a
     * Channel object.
     */
    part: function(channel) {
      if (typeof(channel) === 'object') {
        this.socket.emit('part', channel.get('id'));
      }
      else {
        this.socket.emit('part', channel);
      }
    }

  }
});
