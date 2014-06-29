import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.get('store').createRecord('channel', {
      name: 'New Channel'
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
      var self = this;

      var success = function() {
        self.transitionTo("channels");
      };

      var failure = function() {
        self.set('controller.saveFailed', true);
      };

      promise.then(success, failure);
    }
  }
});
