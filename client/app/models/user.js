import DS from 'ember-data';

var User = DS.Model.extend({
  nickname: DS.attr('string'),
  server: DS.belongsTo('server'),
  channels: DS.hasMany('channel')
});

User.reopenClass({
  FIXTURES: [
    {
      id: 1,
      nickname: "somenick",
      server: 1,
      channels: [1]
    },
    {
      id: 2,
      nickname: "othernick",
      server: 1,
      channels: [1]
    }
  ]
});

export default User;