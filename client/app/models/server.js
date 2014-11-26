import DS from 'ember-data';

var Server = DS.Model.extend({
  name: DS.attr('string'),
  host: DS.attr('string'),
  port: DS.attr('string'),

  //the user representing "us" on this server; i.e., our own connection
  nick: DS.attr('string'),

  channels: DS.hasMany('channel', {async: true})
});

export default Server;
