import { test, moduleForModel } from 'ember-qunit';

moduleForModel('server', 'Server', {
  // Specify the other units that are required for this test.
  needs: [
    'model:channel',
    'model:user'
  ]
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(model);
});
