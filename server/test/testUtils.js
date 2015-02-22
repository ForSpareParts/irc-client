var EventEmitter = require('events').EventEmitter;

var utils = require('../utils');

describe('The utils library', function() {
  it('should allow us to bind a callback to a group of events', function(done) {
    var emitter = new EventEmitter();
    utils.callAfterAllEvents(
      emitter,
      ['eventA', 'eventB'],
      function(eventArgs) {
        assert.strictEqual(eventArgs.eventA[0], 'string arg');
        assert.strictEqual(eventArgs.eventB[0], 3);
        assert.strictEqual(eventArgs.eventB[1], 4);
        done();
      });

    emitter.emit('eventA', 'string arg');
    emitter.emit('eventB', 3, 4);
  });
});
