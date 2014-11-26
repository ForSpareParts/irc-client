import DS from 'ember-data';

var Channel = DS.Model.extend({
  name: DS.attr('string'),
  server: DS.belongsTo('server', {async: true}),

  messages: DS.hasMany('message', {async: true})
});

export default Channel;