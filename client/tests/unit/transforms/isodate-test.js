import {
  describeModule,
  it
} from 'ember-mocha';

describeModule('transform:isodate', 'IsodateTransform', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
}, function() {
  // Replace this with your real tests.
  it('should exist', function() {
    var transform = this.subject();
    assert.ok(transform);
  });
});
