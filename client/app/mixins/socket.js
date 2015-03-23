import Ember from 'ember';
/* global EventEmitter, io */

var fakeSocket, serverSocket;

export default Ember.Mixin.create({
  init: function() {
    this._super();
    fakeSocket = new EventEmitter();
    serverSocket = io.connect();
  },

  socket: {
    /**
    * Register the handler on both the socket and the local
    * EventEmitter.
    */
    on: function(eventName, handler) {
      fakeSocket.on(eventName, handler);
      serverSocket.on(eventName, handler);
    },

    /**
    * As on(), but only handle eventName one time.
    */
    once: function(eventName, handler) {
      fakeSocket.once(eventName, handler);
      serverSocket.once(eventName, handler);
    },

    /**
     * Sends a local event
     */
    localEmit: function(eventName) {
      fakeSocket.emit.apply(fakeSocket, arguments);
    }
  }
});
