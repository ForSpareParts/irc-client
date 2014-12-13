import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.get('store').createRecord('channel');
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
      model.set('server', this.get('selectedServer'));
      var self = this;

      model.save()

      .then(function() {
        self.transitionTo("channel", model);
      })

      .catch(function() {
        self.set('controller.saveFailed', true);
      });

    }
  }
});
