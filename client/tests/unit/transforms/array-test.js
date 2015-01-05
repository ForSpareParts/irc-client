/* jshint expr:true */
import {
  describeModule,
  it
} from 'ember-mocha';

describeModule(
  'transform:array',
  'ArrayTransform',
  {
    // Specify the other units that are required for this test.
    // needs: ['transform:foo']
  },
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      var transform = this.subject();
      expect(transform).to.be.ok;
    });
  }
);
