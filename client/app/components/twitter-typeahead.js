import FormInput from './form-input';

var displayValuePath = 'name';

export default FormInput.extend({

  // focusOut: function() {
  //   var path = this.get('displayValuePath');
  //   var value = this.get('value');
  //   var self = this;

  //   this.set('selection', null);

  //   this.get('content').forEach(function(item) {
  //     if (item.get() === value) {
  //       self.set('selection', item);
  //     }
  //   });

  //   return this._super();
  // },

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
    // this.$().typeahead(
    //   {
    //     highlight: true,
    //     minLength: 1
    //   },
    //   {
    //     name: this.get('name'),
    //     displayKey: 'displayValue',
    //     source: this.source.bind(this)
    //   });

    // this.$().bind('typeahead:selected typeahead:autocompleted',
    //   function(e, datum) {
    //     if (e.target === this.get('element')) {
    //       this.set('selection', datum.item);
    //     }
    //   }.bind(this));

    // var initialSelection = this.get('selection');
    // if (initialSelection) {
    //   this.set(
    //     'value',
    //     initialSelection.get(displayValuePath));
    // }
  },

  valid: function() {
    // Values in 'selection' are always promise proxies for models. By this
    // point, they should *always* be resolved, so _data should have a model in
    // it (or null).
    var selection = this.get('selection');

    if (selection && selection._data) {
      return true;
    }

    return false;
  }.property('selection'),

  selection: function() {
    var value = this.get('value');
    return this.get('content').findBy(displayValuePath, value);
  }.property('value', 'content'),

  meaninglessProperty: function() {
    return true;
  }.property('value')

});
