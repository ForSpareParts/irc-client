/* jshint expr:true */
import {
  describeModule,
  it
} from 'ember-mocha';
/** global sinon */

describeModule(
  'adapter:connection',
  'ConnectionAdapter',
  {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  },
  function() {
    it('refuses to be created, updated, or deleted', function() {
      var adapter = this.subject();
      
      isRejected(function() {
        return adapter.createRecord({});
      }, /cannot be created/);

      isRejected(function() {
        return adapter.updateRecord({});
      }, /cannot be written to/);

      isRejected(function() {
        return adapter.deleteRecord({});
      }, /cannot be deleted/);
    });

    it('refuses to perform a findQuery', function() {
      var adapter = this.subject();

      isRejected(function() {
        return adapter.findQuery();
      }, /is not supported/);
    });
  }
);
