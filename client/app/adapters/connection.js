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

  //this is the default updateRecord implementation, except with PATCH instead
  //of PUT
  updateRecord: function(store, type, record) {
    var data = {};
    var serializer = store.serializerFor(type.typeKey);

    serializer.serializeIntoHash(data, type, record);

    var id = Ember.get(record, 'id');

    return this.ajax(
      this.buildURL(type.typeKey, id, record), "PATCH", { data: data });

  }

});
