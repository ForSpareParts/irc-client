import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var store = this.get('store');
    var promise = store.find('channel', params.channel_id);

    return promise;
  },

  actions: {
    sendMessage: function(messageText, channel) {
      var promise = channel.get('server.connectionUser');
      var store = channel.get('store');

      promise = promise.then(function(user) {
        var message = store.createRecord('message', {
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

        message.save().then(success).catch(failure);
      });
    }
  }
});