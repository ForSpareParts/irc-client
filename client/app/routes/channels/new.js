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
      var self = this;

      model.get('server').then(function(server) {
        //validation
        if (!model.get('name')) {
          throw new Error();
        }

        if (!server) {
          throw new Error();
        }

        return model.save();
      })

      .then(function() {
        self.transitionTo('channel', model);
      })

      .catch(function() {
        self.set('controller.saveFailed', true);
      });
    },

  }
});
