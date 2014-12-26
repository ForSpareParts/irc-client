/* jshint expr:true */
import {
  describeComponent,
  it
} from 'ember-mocha';

describeComponent(
  'servers-modal-content',
  'ServerModalContentComponent',
  {
    needs: [
      'component:server-menu-item',
      'component:server-edit',
      'component:form-input']
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
