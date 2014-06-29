import Ember from 'ember';

var Router = Ember.Router.extend({
  location: IrcENV.locationType
});

Router.map(function() {
  this.resource('servers', function() {
    this.resource('server', { path: ':server_id'});
    this.route('new', { path: 'new' });
  });
  this.resource('channels', function() {
    this.route('new', { path: 'new' });
  });
});

export default Router;
