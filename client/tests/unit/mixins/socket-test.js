/* jshint expr:true */
import Ember from 'ember';
import SocketMixin from 'irc/mixins/socket';

describe('SocketMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    var SocketObject = Ember.Object.extend(SocketMixin);
    var subject = SocketObject.create();
    expect(subject).to.be.ok;
  });
});
