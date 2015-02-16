/* jshint expr:true */
import {
  describeComponent,
  it
} from 'ember-mocha';
import DS from 'ember-data';
import Ember from 'ember';

//trying not to test the typeahead functionality *itself* (since that's not my
//code) and instead focus on everything around it

var makeObject = Ember.Object.create;

var component;
describeComponent(
  'twitter-typeahead',
  'TwitterTypeaheadComponent',
  {
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  },
  function() {
    beforeEach(function() {
      component = this.subject();

      andThen(function() {
        component.set('content', [
          Ember.Object.create({
            id: 1,
            name: 'Some Object'
          }),
          Ember.Object.create({
            id: 2,
            name: 'Another Object'
          })
        ]);
      });
    });

    it('should coerce the content property into a resolved array',
      function () {
        var component = this.subject();

        //start with an array...
        andThen(function() {
          component.set('content', ['foo']);
        });

        //...still an array
        andThen(function() {
          equal(component.get('_content').objectAt(0), 'foo');
        });


        //start with a promise...
        andThen(function() {
          component.set('content', DS.PromiseArray.create({
            promise: Ember.RSVP.resolve(['bar'])
          }));
        });

        //...becomes an array
        andThen(function() {
          equal(component.get('_content').objectAt(0), 'bar');
        });
      }
    );

    it('should filter content', function() {
      andThen(function() {
        component.source('Som', function(matches) {
          equal(matches.length, 1);
          equal(matches[0].displayValue, 'Some Object');
        });
      });
    });

    it('should select an object from content based on input', function() {
      this.render();
      andThen(function() {
        component.set('value', 'Another Object');
      });

      andThen(function() {
        var selection = component.get('selection');
        equal(selection.get('id'), 2);
        equal(selection.get('name'), 'Another Object');
      });
    });

  }
);
