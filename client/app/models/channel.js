import DS from 'ember-data';

var Channel = DS.Model.extend({
  name: DS.attr('string'),
  server: DS.belongsTo('server', {async: true}),

  messages: DS.hasMany('message', {async: true}),

  joined: function() {
    var allJoined = this.get('server.connection.joined');

    if (allJoined) {
      return allJoined.indexOf(this.get('name')) > -1;      
    }

    //if we can't access the joined list right now, we're not joined
    return false;

  }.property('name', 'server.connection.joined')
});

export default Channel;