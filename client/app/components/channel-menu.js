import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['channel-menu'],

  actions: {
    part: function(channel) {
      this.sendAction('part', channel);
    }
  }
});
