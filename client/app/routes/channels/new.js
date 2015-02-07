import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.get('store').createRecord('channel');
  },

  deactivate: function() {
    var model = this.get('controller.model');
    if (model.get('dirtyType') === 'created') {
      model.deleteRecord();


      //if we were rejoining a channel that existed before, there'll be an extra
      //copy of the channel in the 
      this.send('refreshJoined');
    }

  },

  actions: {
    save: function(model) {
      var self = this;
      var server;

      model.get('server').then(function(fetchedServer) {
        server = fetchedServer;
        //validation
        if (!model.get('name')) {
          throw new Error();
        }

        if (!server) {
          throw new Error();
        }

        //try to find an existing Channel that matches
        return self.store.find('channel', {
          name: model.get('name'),
          // server: model.get('server') //TODO: server doesn't actually use this yet!
        });
      })

      .then(function(fetchedChannels) {
        if (fetchedChannels.content.length > 0) {
          //we found an existing Channel

          //we don't have to delete our new/unsaved one -- it'll get cleaned up
          //when the route is deactivated
          model = fetchedChannels.objectAt(0);
          return Ember.RSVP.resolve(model);
        }

        //no old Channel -- save ours!
        return model.save();
      })

      .then(function() {
        return server.get('connection');
      })

      .then(function(connection) {
        return connection.join(model);
      })

      .then(function() {
        self.send('refreshJoined');
        self.transitionTo('channel', model);
      })

      .catch(function() {
        self.set('controller.saveFailed', true);
      });
    },

  }
});
