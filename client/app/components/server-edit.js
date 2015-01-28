import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['create-edit', 'server'],

  actions: {
    save: function(server) {
      var self = this;

      if (server.get('localValid')) {
        return server.save()
        .then(function() {
          self.set('saveFailed', false);
        });
      }

      this.set('saveFailed', true);
      return Ember.RSVP.reject();
    },

    connect: function(server) {
      return server.get('connection')

      .then(function(connection) {
        connection.set('connected', true);
        return connection.save();
      });
    },

    disconnect: function(server) {
      return server.get('connection')

      .then(function(connection) {
        connection.set('connected', false);
        return connection.save();
      });
    }
  }
});
