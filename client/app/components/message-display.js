import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',

  classNameBindings: [
    'message.isJoin:join',
    'message.isPart:part',
    'message.isEvent:event'
  ]
});
