import DS from 'ember-data';
/* global moment */
//NOTE: watch ember-cli for better AMD compliance: moment supports AMD and the
//global is deprecated

//stores date objects as ISO-8601 and retrieves them as moment.js objects
export default DS.Transform.extend({
  deserialize: function(serialized) {
    return moment(serialized, moment.ISO_8601);
  },

  serialize: function(deserialized) {
    return deserialized.toISOString();
  }
});
