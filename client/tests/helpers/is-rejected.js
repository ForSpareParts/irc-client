import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('isRejected',
  function(app, promiseReturningFunction) {
    Ember.run(function() {
      assert.isRejected(promiseReturningFunction());
    });

    return wait();
  });
