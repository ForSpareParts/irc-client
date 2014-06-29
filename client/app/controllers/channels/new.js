import Ember from 'ember';

export default Ember.ObjectController.extend({
  allServers: function() {
    return this.get('store').find('server');
  }.property()
});
