import Ember from 'ember';

var Router = Ember.Router.extend({
  location: IrcENV.locationType
});

Router.map(function() {
  this.resource('servers', function() {
    this.resource('servers/new', { path: 'new' })
  });
});

export default Router;
