import DS from 'ember-data';

var Server = DS.Model.extend({
  name: DS.attr('string'),
  host: DS.attr('string'),
  port: DS.attr('string'),

  //the user representing "us" on this server; i.e., our own connection
  nick: DS.attr('string'),

  channels: DS.hasMany('channel', {async: true}),

  menuItemId: function() {
    if (this.get('id')) {
      return 'server-' + this.get('id');
    }

    return 'server-new';
  }.property('id'),

  /**
   * Whether the instance *appears* valid (distinct from the 'valid' state,
   * which reflects server-side validation)
   */
  localValid: function() {
    if (
        this.get('name') &&
        this.get('host') &&
        this.get('nick')) {
      return true;
    }

    return false;
  }.property('name', 'host', 'port', 'nick')
});

export default Server;
