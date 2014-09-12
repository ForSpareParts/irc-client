import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('server', params.server_id);
  },

  actions: {
    save: function(model) {
      var promise = model.save();
      var self = this;

      var success = function() {
        self.transitionTo("servers");
      };

      var failure = function() {
        self.set('controller.saveFailed', true);
      };

      promise.then(success, failure);
    },

    willTransition: function() {
      var model = this.get('controller.model');
      model.rollback();
      if (model.get('isNew')) {
        model.deleteRecord();
      }
    }
  },

  templateName: 'server'
});
