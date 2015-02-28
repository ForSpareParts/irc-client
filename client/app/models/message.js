import DS from 'ember-data';
//NOTE: watch ember-cli for better AMD compliance: moment supports AMD and the
//global is deprecated

var Message = DS.Model.extend({
  channel: DS.belongsTo('channel', {async: true}),
  time: DS.attr('isodate'),
  nick: DS.attr('string'),
  contents: DS.attr('string'),
  type: DS.attr('string'),

  shortTime: function() {
    return this.get('time').format('hh:mm A');
  }.property('time'),

  isJoin: function() {
    return this.get('type') === 'join';
  }.property('type'),

  isPart: function() {
    return this.get('type') === 'part';
  }.property('type'),

  isEvent: function() {
    return this.get('isJoin') || this.get('isPart');
  }.property('isJoin', 'isPart')
});

export default Message;
