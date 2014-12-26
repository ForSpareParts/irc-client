import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',

  click: function() {
    this.set('showProperty', true);
  }
});
