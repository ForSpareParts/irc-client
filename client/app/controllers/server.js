import Ember from 'ember';

export default Ember.ObjectController.extend({
  menuItemId: function() {
    return "server-" + this.get('id');
  }.property('id')
});
