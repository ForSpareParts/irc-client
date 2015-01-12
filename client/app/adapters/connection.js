import Ember from 'ember';
import ApplicationAdapter from './application';

/**
 * Every Server implicitly has a Connection resource that tracks its current
 * state. Connections *cannot* be created or destroyed by the client, except
 * by creating or destroying Servers.
 *
 * Essentially, a Connection stores and updates state that lives and dies with
 * the application instance: if the backend goes down, all Servers are
 * disconnected and all Channels parted. We do this in a separate resource
 * because storing and updating that kind of volatile state in the same resource
 * as the database stuff (host, port, nick) turns out to be *really* clumsy for
 * the backend.
 */
export default ApplicationAdapter.extend({
  buildURL: function(type, id) {
    //type should always be 'connection'
    //the ID of a Connection always matches that of its Server
    return [
      this.urlPrefix(),
      'servers',
      id,
      type].join('/');
  },

  //a POST would 405 anyway, but let's save ourselves the trip
  createRecord: function() {
    return Ember.RSVP.reject(
      new Ember.Error('Connections cannot be created by the client.'));
  },

  //same as createRecord
  deleteRecord: function() {
    return Ember.RSVP.reject(
      new Ember.Error('Connections cannot be deleted by the client.'));
  },


  //there's no equivalent path for findAll/findQuery on the backend
  //shouldn't really need one, but could implement it later if necessary
  findAll: function() {
    return Ember.RSVP.reject(
      new Ember.Error('findAll is not supported for Connections'));
  },

  findQuery: function() {
    return Ember.RSVP.reject(
      new Ember.Error('findQuery is not supported for Connections'));
  },


  //The backend API for connection uses separate paths for connection
  //properties, i.e.:
  //
  // POST /servers/1/connection/connected: {connected: true}
  // 
  // instead of
  // 
  // PUT /servers/1/connection: {connection: {connected: true}}
  // 
  //We're doing this because it's simply easier to write on the backend (see
  //server/routes/connection.js). The frontend inherits the mess, of course,
  //but I think it's easier to handle here.
  updateRecord: function(store, type, record) {
    //WARNING: of course, this means that an update to a Connection isn't
    //necessarily atomic. Oh, well. Most of the time we're only going to update
    //connected or joined, anyway.
    var id = Ember.get(record, 'id');
    var url = this.buildURL(type.typeKey, id, record);

    var adapter = this;

    var changedAttributes = record.changedAttributes();

    if (changedAttributes.hasOwnProperty('server')) {
      return Ember.RSVP.reject(
        new Ember.Error('Can\'t reassign a Connection to a different Server.'));
    }


    var promise = Ember.RSVP.resolve(null);

    if (changedAttributes.hasOwnProperty('connected')) {
      promise.then(function() {
        adapter.ajax(url, "POST", record.get('connected'));
      });
    }

    if (changedAttributes.hasOwnProperty('joined')) {
      //NOTE: sends the whole channel list each time. might be inefficient.
      promise.then(function() {
        adapter.ajax(url, "POST", record.get('joined'));
      });
    }

    return promise;
  }

});
