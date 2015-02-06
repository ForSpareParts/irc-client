import Ember from 'ember';

export default Ember.Route.extend({
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
      var foo = channels.filterBy('joined', true);
      return foo;
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
    }

  }
});
