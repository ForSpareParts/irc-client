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
  this.resource('channels', function() {
    this.resource('channel', { path: ':channel_id'});
    this.route('new', { path: 'new' });
  });
});

export default Router;
