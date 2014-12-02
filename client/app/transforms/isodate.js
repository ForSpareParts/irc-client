import DS from 'ember-data';
/* global moment */
//TODO: figure out how to import moment properly, since the global is deprecated
//and also lame

//stores date objects as ISO-8601 and retrieves them as moment.js objects
export default DS.Transform.extend({
  deserialize: function(serialized) {
    return moment(serialized, moment.ISO_8601);
  },

  serialize: function(deserialized) {
    return deserialized.toISOString();
  }
});
