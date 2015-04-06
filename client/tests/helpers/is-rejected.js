import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('isRejected',
  function(app, promiseReturningFunction, matcher) {
    Ember.run(function() {
      if (matcher) {
        assert.isRejected(promiseReturningFunction(), matcher);
      }
      else {
        assert.isRejected(promiseReturningFunction());
      }
    });

    return wait();
  });
