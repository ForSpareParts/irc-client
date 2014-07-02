import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var promise = this.get('store').find('server');
    promise.then(function(servers) {
      return servers;
    });
    return promise;
  }
});
