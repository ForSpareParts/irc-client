import Ember from 'ember';

export default Ember.Test.registerHelper('channelMenuItems', function(app) {
  return find('.channel-menu .channels li');
});
