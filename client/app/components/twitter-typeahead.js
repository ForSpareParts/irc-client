import FormInput from './form-input';

export default FormInput.extend({
  focusOut: function() {
    var path = this.get('displayValuePath');
    var value = this.get('value');
    var self = this;

    this.set('selection', null);

    this.get('content').forEach(function(item) {
      if (item.get(path) === value) {
        self.set('selection', item);
      }
    });

    return this._super();
  },

  /** See typeahead.js docs for information on source() **/
  source: function(q, cb) {
    var path = this.get('displayValuePath');

    this.get('content').then(function(content) {
      var matches = content.map(function(item) {
        return {
          item: item,
          displayValue: item.get(path)
        };
      }).filter(function(typeaheadObj) {
        return (typeaheadObj.item.get(path).indexOf(q) !== -1);
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

    this.$().bind('typeahead:selected typeahead:autocompleted',
      function(e, datum) {
        if (e.target === this.get('element')) {
          this.set('selection', datum.item);
        }
      }.bind(this));

    var initialSelection = this.get('selection');
    if (initialSelection) {
      var path = this.get('displayValuePath');
      this.set(
        'value',
        initialSelection.get(path));
    }
  },

  validationPath: 'selection'
});
