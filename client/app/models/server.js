import DS from 'ember-data';

var Server = DS.Model.extend({
  name: DS.attr('string'),
  host: DS.attr('string'),
  port: DS.attr('string'),

  users: DS.hasMany('user', {async: true}),

  //the user representing "us" on this server; i.e., our own connection
  connectionUser: DS.belongsTo('user', {async: true})
});

Server.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: 'FooServer',
      host: 'irc.foo.net',
      port: '6667',

      connectionUser: 3
    },
    {
      id: 2,
      name: 'BarServer',
      host: 'irc.bar.net',
      port: '6667'
    }
  ]
});

export default Server;