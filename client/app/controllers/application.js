import Ember from 'ember';

export default Ember.Controller.extend({
  allServers: function() {
    return this.get('store').find('server');
  }.property(),

  actions: {
    part: function(channel) {
      return channel.get('server.connection')

      .then(function(connection) {
        return connection.part(channel);
      })

      .then(connection => {
        if (this.get('currentPath')) {
          this.transitionTo('index');
        }

        this.send('refreshJoined');
      });
    }
  }
});
