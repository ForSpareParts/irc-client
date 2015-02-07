/* jshint expr:true */
import {
  describeComponent,
  it
} from 'ember-mocha';
import Ember from 'ember';
import DS from 'ember-data';


describeComponent(
  'server-edit',
  'ServerEditComponent',
  {
    // specify the other units that are required for this test
    needs: [
      'model:server',
      'model:channel',
      'model:message',
      'model:connection',
      'adapter:application',
      'adapter:connection',
      'transform:array'
    ]
  },
  function() {
    it('connects and disconnects the server', function() {
      this.timeout(0);

      DS._setupContainer(this.container);
      var store = this.container.lookup('store:main');

      var component = this.subject();


      Ember.run(function() {
        return store.find('server', 1)

        .then(function(server) {
          component.set('server', server);
          return component.send('connect', server);
        })

        .then(function() {
          return component.get('server.connection');
        })

        .then(function(connection) {
          equal(connection.get('connected'), true);
        });
      });

      wait();
    });
  }
);
