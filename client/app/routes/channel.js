import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('channel', params.channel_id);
  },

  actions: {
    sendMessage: function(messageText, channel, user) {
      var message = this.get('store').createRecord('message', {
        user: user,
        channel: channel,
        time: Date(Date.now()),

        message: messageText
      });

      var success = function(savedMessage) {
        channel.get('messages').addObject(savedMessage);
      };

      var failure = function(reason) {
        console.log(reason);
      };

      message.save(success, failure);
    }
  }
});