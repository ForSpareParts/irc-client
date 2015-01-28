import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['isActive:active', 'server.connected:connected'],

  click: function() {
    this.sendAction('action', this.get('server'));
  },

  tagName: 'li',

  isActive: function() {
    return this.get('server') === this.get('activeServer');
  }.property('server', 'activeServer'),

});
