import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('channelMenuItems', function(app) {
  return find('.channel-menu .channels li');
});
