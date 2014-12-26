import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.get('store').find('channel');
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
    }

  }
});
