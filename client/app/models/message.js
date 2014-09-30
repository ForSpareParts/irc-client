import DS from 'ember-data';
import Ember from 'ember';
/* global moment */
//NOTE: watch ember-cli for better AMD compliance: moment supports AMD and the
//global is deprecated

var Message = DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  channel: DS.belongsTo('channel', {
    async: true,
    inverse: 'messages'
  }),
  time: DS.attr('isodate'),

  message: DS.attr('string'),

  shortTime: function() {
    Ember.debug(this.get('time'));
    return this.get('time').format('hh:mm A');
  }.property('time')
});

Message.reopenClass({
  FIXTURES: [
    {
      id: 1,
      user: 1,
      channel: 1,
      time: moment('2000-01-01T00:00:00', moment.ISO_8601),

      message: 'Hi!'
    },
    {
      id: 2,
      user: 2,
      channel: 1,
      time: moment('2000-01-01T00:01:00', moment.ISO_8601),

      message: 'Hi, yourself!'
    },
  ]
});

export default Message;
