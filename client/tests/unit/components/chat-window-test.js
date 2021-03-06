/* jshint expr:true */
import {
  describeComponent,
  it
} from 'ember-mocha';

describeComponent(
  'chat-window',
  'ChatWindowComponent',
  {
    needs: ['component:message-input']
  },
  function() {
    it('renders', function() {
      // creates the component instance
      var component = this.subject();
      expect(component._state).to.equal('preRender');

      // renders the component on the page
      this.render();
      expect(component._state).to.equal('inDOM');
    });
  }
);
