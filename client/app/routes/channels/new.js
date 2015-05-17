import Ember from 'ember';

export default Ember.Route.extend({
  socket: Ember.inject.service('socket'),

  model: function() {
    return Ember.Object.create();
  },

  actions: {
    save: function(model) {
      var self = this;
      var serverID = model.get('server.id');

      this.send('join', model.get('name'), serverID);
    },

  }
});
