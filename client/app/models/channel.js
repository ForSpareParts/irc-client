import DS from 'ember-data';

var Channel = DS.Model.extend({
  name: DS.attr('string'),
  server: DS.belongsTo('server', {async: true}),

  users: DS.hasMany('user', {async: true}),
  messages: DS.hasMany('message', {async: true})
});

Channel.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: "#somechannel",
      server: 1,

      users: [1, 2],
      messages: [1, 2]
    }
  ]
});

export default Channel;