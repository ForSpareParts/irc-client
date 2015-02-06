import Ember from 'ember';
/* global moment */

export default Ember.Route.extend({
  model: function(params) {
    var store = this.get('store');
    return store.find('channel', params.channel_id);
  },

  actions: {

    /** Send messageText to the Channel. */
    sendMessage: function(messageText, callback) {
      //NOTE: see message-input.js for reasoning behind callback
      var channel = this.modelFor(this.routeName);
      var store = channel.get('store');

      var message;

      channel.get('server')

      .then(function(server) {
        message = store.createRecord('message', {
          nick: server.get('nick'),
          channel: channel,
          time: moment(new Date(Date.now())),

          contents: messageText,
        });

        return message.save();
      })

      .then(function(savedMessage) {
        channel.get('messages').addObject(savedMessage);

        if (callback){
          callback();
        }

      })

      .catch(function(reason) {
        message.deleteRecord();
        if (callback){
          callback(reason);
        }
      });
    }
  }
});