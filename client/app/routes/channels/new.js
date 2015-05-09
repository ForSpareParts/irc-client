import Ember from 'ember';

export default Ember.Route.extend({
  socket: Ember.inject.service('socket'),

  model: function() {
    return Ember.Object.create();
  },

  // deactivate: function() {
  //   var model = this.get('controller.model');
  //   if (model.get('dirtyType') === 'created') {
  //     model.deleteRecord();


  //     //if we were rejoining a channel that existed before, there'll be an extra
  //     //copy of the channel in the 
  //     this.send('refreshJoined');
  //   }

  // },

  actions: {
    save: function(model) {
      var self = this;
      var serverID = model.get('server.id');

      this.send('join', model.get('name'), serverID);
    },

  }
});
