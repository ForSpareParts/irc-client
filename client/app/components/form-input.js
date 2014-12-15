import Ember from 'ember';

export default Ember.TextField.extend({
  classNameBindings: ['error'],

  focusOut: function() {
    var self = this;

    if (this.get('required')) {
      this.validPromise()

      .then(function(isValid) {
        if (isValid){
          self.set('error', false);
        }

        else {
          self.set('error', true);
        }

      });
    }
  },

  /* Whether or not this field will run validation. True by default. */
  required: true,

  /**
   * Wraps valid() in a promise (if it's not a promise already).
   * @return {Promise}
   */
  validPromise: function() {
    var path = this.get('validationPath');
    var valid = this.valid(this.get(path));

    if (typeof(valid) === 'boolean') {
      return Ember.RSVP.resolve(valid);
    }

    if (valid.then) {
      return valid;
    }

    throw new Error('valid() must return a boolean or a promise');
  },

  /**
   * Returns a boolean indicating whether the current value of the field is
   * valid, or a promise that resolves to such a boolean.
   *
   * By default, returns true if the field's value is truthy (or a promise
   * resolving to a truthy value).
   * 
   * @return {[type]} [description]
   */
  valid: function(value) {
    if(!value) {
      return false;
    }

    if (value.then) {
      return value.then(function(resolvedValue) {
        if (resolvedValue) {
          return true;
        }

        return false;
      });
    }

    return true;
  },

  /** Property to use in validation. */
  validationPath: 'value'

});
