import FormInput from './form-input';

var displayValuePath = 'name';

export default FormInput.extend({

  classNameBindings: ['error'],

  content: [],

  /** See typeahead.js docs for information on source() **/
  source: function(q, cb) {

    this.get('content').then(function(content) {
      var matches = content.map(function(item) {
        return {
          item: item,
          displayValue: item.get(displayValuePath)
        };
      }).filter(function(typeaheadObj) {
        return (typeaheadObj.item.get(displayValuePath).indexOf(q) !== -1);
      });

      cb(matches);
    });
  },

  didInsertElement: function() {
    this.$().typeahead(
      {
        highlight: true,
        minLength: 1
      },
      {
        name: this.get('name'),
        displayKey: 'displayValue',
        source: this.source.bind(this)
      });

    var initialModel = this.get('selection');
    if (initialModel) {
      this.set(
        'value',
        initialModel.get(displayValuePath));
    }
  },

  valid: function() {
    // Values in 'currentModel' are always promise proxies for models. By this
    // point, they should *always* be resolved, so _data should have a model in
    // it (or null).
    var currentModel = this.get('currentModel');

    if (currentModel && currentModel._data) {
      return true;
    }

    return false;
  }.property('currentModel'),

  currentModel: function() {
    var value = this.get('value');
    return this.get('content').findBy(displayValuePath, value);
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
  }.observes('currentModel')

});
