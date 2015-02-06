import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.get('store').find('channel')

    .then(function(channels) {
      var foo = channels.filterBy('joined', true);
      return foo;
    });
  }
});
