import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['channel'],

  actions: {
    sendMessage: function(message, callback) {
      this.sendAction('sendMessage', message, callback);
    }
  }
});
