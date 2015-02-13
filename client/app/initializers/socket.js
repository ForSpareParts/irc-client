/* global io */

export function initialize(container, application) {
  //TODO: figure out how to integrate this smoothly with Ember
  var socket = io.connect();
  var store;

  socket.on('message', function(data) {
    if (!store) {
      store = container.lookup('store:main');
    }

    store.pushPayload('message', data);
  });
}

export default {
  name: 'socket',
  initialize: initialize
};
