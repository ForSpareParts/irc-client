/**
 * Call the callback after all events in the events array have fired on the
 * emitter. Similar to to Promise.all(), and allows a promise to resolve after
 * several events have fired.
 *
 * Callback gets an eventArgs object that maps event names to their `arguments`
 * objects.
 * @param  {object} emitter
 * @param  {[string]}   events
 * @param  {Function} callback
 */
module.exports.callAfterAllEvents = function(emitter, events, callback) {

  var eventArgs = {};

  var tryCompleteFunction = function(event) {

    return function() {
      console.log('received event: ' + event);
      //the rest of the arguments (if any) are what were sent with the event
      eventArgs[event] = arguments;

      //use a standard for-loop so we can break out of the function with an
      //early return
      for (var i = 0; i < events.length; i++) {
        var checkEvent = events[i];
        if (eventArgs[checkEvent] === undefined) {
          return false;
        }
      }

      callback(eventArgs);
    };
  };

  events.forEach(function(event) {
    emitter.once(event, tryCompleteFunction(event));
  });
};
