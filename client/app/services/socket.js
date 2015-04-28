import Ember from 'ember';
/* global EventEmitter, io */

var fakeIncoming, fakeOutgoing, serverSocket;

export default Ember.Service.extend({
  init: function() {
    this._super();
    fakeIncoming = new EventEmitter();
    fakeOutgoing = new EventEmitter();
    serverSocket = io.connect();
  },

  socket: {
    /**
    * Register the handler on both the socket and the local
    * EventEmitter.
    */
    on: function(eventName, handler) {
      fakeIncoming.on(eventName, handler);
      serverSocket.on(eventName, handler);
    },

    /**
    * As on(), but only handle eventName one time.
    */
    once: function(eventName, handler) {
      fakeIncoming.once(eventName, handler);
      serverSocket.once(eventName, handler);
    },

    /**
     * Sends an event to the server with any number of arguments, e.g.:
     * socket.emit('join', '#somechannel');
     */
    emit: function(eventName) {
      fakeOutgoing.emit.apply(fakeOutgoing, arguments);
      serverSocket.emit.apply(serverSocket, arguments);
    },

    /**
     * Sends a local event (used for testing)
     */
    localEmit: function(eventName) {
      fakeIncoming.emit.apply(fakeIncoming, arguments);
    },

    /**
     * Triggers handler for eventName when eventName is sent to the server
     * (used for testing)
     */
    onOutgoing: function(eventName, handler) {
      fakeOutgoing.on(eventName, handler);
    },

     /**
     * As onOutgoing, but only handles eventName once.
     */
    onceOutgoing: function(eventName, handler) {
      fakeOutgoing.once(eventName, handler);
    }
  }
});
