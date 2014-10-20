var Promise = require('bluebird');

var common = require('./common')
  , Bookshelf = common.Bookshelf
  , knex = common.knex

  , Channel = require('./channel')
  , Message = require('./message')
  , Server = require('./server')


/** Drop all data from the current database. */
var truncateAll = function() {
  return Promise.all([
    Channel.query().truncate(),
    Message.query().truncate(),
    Server.query().truncate(),
  ]);
};

//register all models with bookshelf so they can be referred to by name
Bookshelf.model('Channel', Channel);
Bookshelf.model('Message', Message);
Bookshelf.model('Server', Server);

module.exports = {
  Channel: require('./channel'),
  Message: require('./message'),
  Server: require('./server'),

  migrateLatest: common.migrateLatest,
  truncateAll: truncateAll
};
