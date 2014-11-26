import DS from 'ember-data';
import Ember from 'ember';
//NOTE: watch ember-cli for better AMD compliance: moment supports AMD and the
//global is deprecated

var Message = DS.Model.extend({
  channel: DS.belongsTo('channel', {async: true}),
  time: DS.attr('isodate'),
  message: DS.attr('string'),

  shortTime: function() {
    Ember.debug(this.get('time'));
    return this.get('time').format('hh:mm A');
  }.property('time')
});

export default Message;
