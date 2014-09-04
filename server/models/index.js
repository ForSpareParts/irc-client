var bluebird = require('bluebird');

var common = require('./common')
  , knex = common.knex

  , Channel = require('./channel')
  , ChannelUser = require('./channel_user')
  , Message = require('./message')
  , Server = require('./server')
  , User = require('./user');


/** Update the current database to the most recent migration. */
var migrateLatest = function() {
  return knex.migrate.latest();
}

/** Drop all data from the current database. */
var truncateAll = function() {
  return bluebird.all([
    Channel.query().truncate(),
    ChannelUser.query().truncate(),
    Message.query().truncate(),
    Server.query().truncate(),
    User.query().truncate()
  ]);
};

module.exports = {
  Channel: require('./channel'),
  ChannelUser: require('./channel_user'),
  Message: require('./message'),
  Server: require('./server'),
  User: require('./user'),

  migrateLatest: migrateLatest,
  truncateAll: truncateAll
};

