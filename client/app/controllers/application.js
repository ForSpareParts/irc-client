import Ember from 'ember';

export default Ember.Controller.extend({
  allServers: function() {
    return this.get('store').find('server');
  }.property()
});
