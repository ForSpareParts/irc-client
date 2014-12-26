import Ember from 'ember';

export default Ember.Component.extend({
  //prevents click from bubbling to parent, where it would close the modal
  click: function() {
    return false;
  },

  /**
   * Rollback unsaved changes and delete unpersisted models when the
   * activeServer value changes.
   */
  cleanupEdit: function() {
    //we don't know which one was the old value, so we do a rollback on all
    //servers
    this.get('servers').forEach(function(server) {
      server.rollback();
      if (server.get('isNew')) {
        server.deleteRecord();
      }
    });
  }.observes('activeServer'),

  actions: {
    setActive: function(server) {
      this.set('activeServer', server);
    },

    newServer: function() {
      this.sendAction('newServer', this);
    }
  }
});
