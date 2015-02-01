import Ember from 'ember';

/** The text field on a chat channel where the user enters a new message. */
export default Ember.TextField.extend({
  onEvent: 'keyPress',

  /** If event.keyCode is Enter, and the input is not empty, send the content
  of the message input as a send event (to be handled by the parent context)
  Otherwise, do nothing.

  We can't do this with the 'enter' event, because that's triggered on keyUp,
  and we want the event to go out as soon as the key is pressed.*/
  keyPress: function(event) {
    var self = this;
    if (event.keyCode === 13 && this.get('value') !== '') {

      //I'm only doing this callback-style because Ember doesn't currently
      //expose the results of an action. We need to know whether the send
      //succeeded so we know if we should clear the input.
      //TODO: Revisit this as soon as the new actions API is out.
      this.sendAction('sendMessage', this.get('value'), function(err) {
        if (!err) {
          self.set('value', '');
        }
      });

    }
  },
});
