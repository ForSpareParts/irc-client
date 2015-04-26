var EventEmitter = require('events').EventEmitter;
module.exports = new EventEmitter();



// var oldOn = module.exports.on;

// var on = function() {
//   console.log('binding ' + arguments[0]);
//   oldOn.apply(module.exports, arguments);
// };

// module.exports.on = on;


// var oldEmit = module.exports.emit;

// var emit = function() {
//   console.log('emitting ' + arguments[0]);
//   oldEmit.apply(module.exports, arguments);
// };

// module.exports.emit = emit;
