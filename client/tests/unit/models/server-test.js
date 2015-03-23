import { describeModel, it } from 'ember-mocha';

describeModel('server', 'Server', {
  // Specify the other units that are required for this test.
  needs: [
    'model:channel',
    'model:connection',
    'model:message',
  ]
}, function() {
  it('should exist', function() {
    var model = this.subject();
    // var store = this.store();
    assert.ok(model);
  });
});
