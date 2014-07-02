import DS from 'ember-data';

export default DS.FixtureAdapter.extend({
  queryFixtures: function(fixtures, query) {
    return fixtures.filter(function(item) {
      for(var prop in query) {
        if( item[prop] !== query[prop]) {
          return false;
        }
      }

      return true;
    });
  }
});
