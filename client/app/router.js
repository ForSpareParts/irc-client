import Ember from 'ember';

var Router = Ember.Router.extend({
  location: IrcENV.locationType
});

Router.map(function() {
  this.resource('servers', function() {
    this.route('new', { path: 'new' });
  });
  this.resource('channels');
});

export default Router;
