import Ember from 'ember';

export default Ember.TextField.extend({
  classNameBindings: ['error'],

  /**
   * Whether the field is currently in an error state.
   */
  error: function() {

    if (this.get('required')) {
      return !this.get('valid');
    }

    return false;
  }.property('valid'),

  required: true,

  /**
   * Whether the current value of the field is valid. By default, any truthy
   * value is valid. Doesn't take 'required' into account.
   */
  valid: function() {
    if (this.get('value')) {
      return true;
    }

    return false;
  }.property('value')

});
