import Ember from 'ember';

export default Ember.Component.extend({
  //prevents click from bubbling to parent, where it would close the modal
  click: function() {
    return false;
  },

  actions: {
    close: function() {
      this.sendAction('close');
    },

    setActive: function(server) {
      this.sendAction('setActive', server);
    },

    newServer: function() {
      this.sendAction('newServer', this);
    },

    connect: function(server) {
      this.sendAction('connect', server);
    },

    disconnect: function(server) {
      this.sendAction('disconnect', server);
    }
  }
});
