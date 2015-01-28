import { describeModel, it } from 'ember-mocha';

describeModel('channel', 'Channel', {
  // Specify the other units that are required for this test.
  needs: [
    'model:connection',
    'model:message',
    'model:server',
    'model:user']
}, function() {
  it('should exist', function() {
    var model = this.subject();
    // var store = this.store();
    assert.ok(model);
  });
});
