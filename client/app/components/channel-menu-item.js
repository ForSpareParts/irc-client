import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  attributeBindings: [ 'id' ],
  classNameBindings: [ 'active' ],

  active: function() {
    return this.get('childViews').anyBy('active');
  }.property('childViews.@each.active'),

  id: function() {
    return 'channel-menu-' + this.get('channel.id');
  }.property('channel'),

  actions: {
    part: function() {
      this.sendAction('part', this.get('channel'));
    }
  }
});
