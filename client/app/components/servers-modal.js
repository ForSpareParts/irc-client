import Ember from 'ember';

export default Ember.Component.extend({

  classNameBindings: ['show'],

  activeServer: null,

  show: false,

  click: function() {
    this.triggerAction({
      action: 'close',
      target: this
    });
  },
  /**
   * Rollback unsaved changes and delete unpersisted models when the
   * activeServer value changes.
   */
  cleanupEdit: function() {
    this.rollback();
  }.observes('activeServer'),

  resetOnClose: function() {
    if (this.get('show') === false) {
      //triggers a rollback as a side-effect
      this.set('activeServer', null);
    }
  }.observes('show'),

  rollback: function() {
    //we won't know which one was the old value, so we do a rollback on all
    //servers
    this.get('servers').forEach(function(server) {
      server.rollback();
      if (server.get('isNew')) {
        server.deleteRecord();
      }
    });
  },

  actions: {
    close: function() {
      this.set('show', false);
    },

    setActive: function(server) {
      this.set('activeServer', server);
    },

    newServer: function(contentComponent) {
      this.sendAction('newServer', contentComponent);
    }
  }
});
