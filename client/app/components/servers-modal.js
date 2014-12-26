import Ember from 'ember';

export default Ember.Component.extend({

  classNameBindings: ['show'],

  click: function() {
    this.set('show', false);
  },

  show: false,

  actions: {
    newServer: function(contentComponent) {
      this.sendAction('newServer', contentComponent);
    }
  }
});
