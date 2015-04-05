import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.resource('channel', { path: '/channels/:channel_id'});
  this.route('channels/new', { path: '/channels/new' });
});
