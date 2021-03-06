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

  findQuery: function() {
    return Ember.RSVP.reject(
      new Ember.Error('findQuery is not supported for Connections'));
  },

  updateRecord: function() {
    return Ember.RSVP.reject(
      new Ember.Error('Connections cannot be written to by the client. Use ' +
        'socket commands to interact with the connection.'));
  },

});
