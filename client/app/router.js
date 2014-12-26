import Ember from 'ember';
import IrcENV from 'irc/config/environment';

var Router = Ember.Router.extend({
  location: IrcENV.locationType
});

Router.map(function() {
  this.resource('channel', { path: '/channels/:channel_id'});
  this.route('channels/new', { path: '/channels/new' });
});

export default Router;
