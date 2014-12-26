import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['channel'],

  actions: {
    sendMessage: function(message) {
      this.sendAction('sendMessage', message);
    }
  }
});
