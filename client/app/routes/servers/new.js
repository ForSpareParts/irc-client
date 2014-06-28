import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.get('store').createRecord('server', {
      name: 'New Server'
    });
  },

  deactivate: function() {
    var model = this.get('controller.model');
    model.rollback();
    if (model.get('isNew')) {
      model.deleteRecord();
    }
  },

  actions: {
    save: function(model) {
      var promise = model.save();

      var success = function() {
        this.transitionTo("servers");
      }.bind(this);

      var failure = function() {
        this.set('controller.saveFailed', true);
      }.bind(this);

      promise.then(success, failure);
    }
  }
});
