import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  init: function() {
    this._super();

    var self = this;
    var _store;

    //we have to wait until the app is up to get the store for the first time,
    //after that we'll cache it
    var getStore = function() {
      if (!_store) {
        _store = self.container.lookup('store:main');
      }

      return _store;
    };

    this.socket.on('message', function(data) {
      getStore().pushPayload('message', data);
    });

    this.socket.on('join', function(data) {
      getStore().pushPayload('message', data);
    });

    this.socket.on('part', function(data) {
      getStore().pushPayload('message', data);
    });
  }
});
