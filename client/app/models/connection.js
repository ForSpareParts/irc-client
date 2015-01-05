import DS from 'ember-data';

//represents the current state of a Server: are we connected, and if so, what
//channels are we in?

//these are created implicitly by the backend -- see adapters/connection.js
export default DS.Model.extend({
  connected: DS.attr('boolean'),
  joined: DS.attr('array'), //currently joined channels
  server: DS.belongsTo('server', {async: true})
});
