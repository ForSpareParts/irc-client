import FormInput from './form-input';

/**
 * Uses typeahead.js to create a FormInput with typeahead functionality.
 * Properties:
 *
 * - 'content': Array or PromiseArray of Objects to serve as typeahead content.
 * - 'selection': The currently selected object from 'content'.
 *
 * 'valid' works as in FormInput. Don't use 'value' -- it's just the text value
 * of the input!
 */
export default FormInput.extend({

  classNameBindings: ['error'],

  content: [],
  displayValuePath: 'name',

  /**
   * Like content, but it's always resolved. Don't set this directly, let the
   * resolveContent observer take care of it.
   * @type {Array}
   */
  _content: [],

  resolveContent: function() {
    var self = this;
    var content = this.get('content');
    if (typeof content.then === 'function') {
      content.then(function(resolvedArray) {
        self.set('_content', resolvedArray);
      });
    }
    else {
      this.set('_content', content);
    }
  }.observes('content').on('init'),



  didInsertElement: function() {
    this.$().typeahead(
      {
        highlight: true,
        minLength: 1
      },
      {
        name: this.get('name'),
        display: 'displayValue',
        source: this.source.bind(this)
      });

    var initialModel = this.get('selection');
    if (initialModel) {
      this.set(
        'value',
        initialModel.get(this.get('displayValuePath')));
    }
  },

  /** See typeahead.js docs for information on source() **/
  source: function(q, cb) {
    var self = this;
    var matches = this.get('_content').map(function(item) {
      return {
        item: item,
        displayValue: item.get(self.get('displayValuePath'))
      };
    }).filter(function(typeaheadObj) {
      return (typeaheadObj.item.get(
        self.get('displayValuePath')).indexOf(q) !== -1);
    });

    cb(matches);
  },

  currentModel: function() {
    var value = this.get('value');
    return this.get('_content').findBy(this.get('displayValuePath'), value);
  }.property('value'),

  /**
   *  Sets a selection property to mirror currentModel. We need this so that the
   *  typeahead field can act like a <select>, with a 'selection' field we can
   *  use with a two-way binding -- e.g., we can't do
   *  {{ twitter-typeahead currentModel=channel.server}} (because that's like
   *  calling set() on a read-only property).
   */
  setSelection: function() {
    this.set('selection', this.get('currentModel'));
  }.observes('currentModel'),

  valid: function() {
    var currentModel = this.get('currentModel');

    if (currentModel) {
      return true;
    }

    return false;
  }.property('currentModel'),

});
