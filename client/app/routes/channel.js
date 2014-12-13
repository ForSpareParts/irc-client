import Ember from 'ember';
/* global moment */

export default Ember.Route.extend({
  model: function(params) {
    var store = this.get('store');
    return store.find('channel', params.channel_id);
  },

  actions: {

    /** Send messageText to the Channel. */
    sendMessage: function(messageText) {
      var channel = this.modelFor(this.routeName);
      var store = channel.get('store');

      channel.get('server')

      .then(function(server) {
        var message = store.createRecord('message', {
          nick: server.get('nick'),
          channel: channel,
          time: moment(new Date(Date.now())),

          contents: messageText
        });

        return message.save();
      })

      .then(function(savedMessage) {
        channel.get('messages').addObject(savedMessage);
        channel.set('messageInput', '');
      })

      .catch(function(reason) {
        console.log(reason);
      });
    }
  }
});