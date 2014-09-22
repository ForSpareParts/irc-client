import DS from 'ember-data';

var Message = DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  channel: DS.belongsTo('channel', {
    async: true,
    inverse: 'messages'
  }),
  time: DS.attr('date'),

  message: DS.attr('string')
});

Message.reopenClass({
  FIXTURES: [
    {
      id: 1,
      user: 1,
      channel: 1,
      time: Date('2000-01-01T00:00:00'),

      message: 'Hi!'
    },
    {
      id: 2,
      user: 2,
      channel: 1,
      time: Date('2000-01-01T00:01:00'),

      message: 'Hi, yourself!'
    },
  ]
});

export default Message;
