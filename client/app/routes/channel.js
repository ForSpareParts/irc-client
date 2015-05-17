import Ember from 'ember';
/* global moment */

export default Ember.Route.extend({
  socket: Ember.inject.service('socket'),

  model: function(params) {
    var store = this.get('store');
    return store.find('channel', params.channel_id);
  },

  actions: {
    /** Send messageText to the Channel. */
    sendMessage: function(messageText, callback) {
      this.get('socket').emit('message', this.get('model.id'), messageText);
    }
  }
});