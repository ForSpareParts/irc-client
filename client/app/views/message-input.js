import Ember from 'ember';

/** The text field on a chat channel where the user enters a new message. */
export default Ember.TextField.extend({
  onEvent: 'keyPressed',

  /** If event.keyCode is Enter, and the input is not empty, send the content
  of the message input as a send event (to be handled by the parent context)
  Otherwise, do nothing.

  We can't do this with the 'enter' event, because that's triggered on keyUp,
  and we want the event to go out as soon as the key is pressed.*/
  keyPress: function(event) {
    if (event.keyCode === 13 && this.value !== '') {
      this.sendAction('send', this.value);
    }
  },
});
