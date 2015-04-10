/* jshint expr:true */
import Ember from 'ember';
import {
  describeModule,
  it
} from 'ember-mocha';
/* global sinon */

describeModule(
  'route:application',
  'ApplicationRoute',
  {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  },
  function() {
    it('sends connect events', function() {
      var route = this.subject();
      var spy = sinon.spy();

      route.socket.onceOutgoing('connect', spy);
      route.send('connect', Ember.Object.create({id: 1}));

      assert.isTrue(spy.calledWith(1));
    });

    it('sends disconnect events', function() {
      var route = this.subject();
      var spy = sinon.spy();

      route.socket.onceOutgoing('disconnect', spy);
      route.send('disconnect', Ember.Object.create({id: 1}));

      assert.isTrue(spy.calledWith(1));
    });

   it('sends join events', function() {
      var route = this.subject();
      var spy = sinon.spy();

      route.socket.onceOutgoing('join', spy);
      route.send('join', Ember.Object.create({id: 1}));

      assert.isTrue(spy.calledWith(1));

      //try it with a string (channel name) instead
      route.socket.onceOutgoing('join', spy);
      route.send('join', '#testjoinchannel');

      assert.isTrue(spy.calledWith('#testjoinchannel'));
    });

    it('sends part events', function() {
      var route = this.subject();
      var spy = sinon.spy();

      route.socket.onceOutgoing('part', spy);
      route.send('part', Ember.Object.create({id: 1}));

      assert.isTrue(spy.calledWith(1));

      //try it with a string (channel name) instead
      route.socket.onceOutgoing('part', spy);
      route.send('part', '#testjoinchannel');

      assert.isTrue(spy.calledWith('#testjoinchannel'));
    });

     
  }
);
