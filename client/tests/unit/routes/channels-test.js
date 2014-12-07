import { describeModule, it } from 'ember-mocha';

describeModule('route:channels', 'ChannelsRoute', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
}, function() {
  it('should exist', function() {
    var route = this.subject();
    assert.ok(route);
  });
});
