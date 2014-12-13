import Ember from 'ember';
import IrcENV from 'irc/config/environment';

var Router = Ember.Router.extend({
  location: IrcENV.locationType
});

Router.map(function() {
  this.resource('servers', function() {
    this.resource('server', { path: ':server_id'});
    this.route('new', { path: 'new' });
  });
  this.resource('channel', { path: '/channels/:channel_id'});
  this.route('channels/new', { path: '/channels/new' });
});

export default Router;
