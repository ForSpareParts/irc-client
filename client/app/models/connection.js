import Ember from 'ember';
import DS from 'ember-data';

//represents the current state of a Server: are we connected, and if so, what
//channels are we in?

//these are created implicitly by the backend -- see adapters/connection.js
export default DS.Model.extend({
  connected: DS.attr('boolean'),
  joined: DS.attr('array'), //currently joined channels
  server: DS.belongsTo('server', {async: true}),

  join: function(channel) {
    if (this.get('joined').indexOf(channel.get('name')) !== -1) {
      //already joined!
      return Ember.RSVP.resolve();
    }

    this.get('joined').push(channel.get('name'));
    return this.save();
  },

  part: function(channel) {
    var index = this.get('joined').indexOf(channel.get('name'));
    if (index === -1) {
      //not in the channel -- no need to part
      return Ember.RSVP.resolve();
    }

    this.get('joined').splice(index, 1);
    return this.save();
  }
});
