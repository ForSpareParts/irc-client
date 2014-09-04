var bluebird = require('bluebird');

var common = require('./common')
  , knex = common.knex

  , Channel = require('./channel')
  , ChannelUser = require('./channel_user')
  , Message = require('./message')
  , Server = require('./server')
  , User = require('./user');


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

  migrateLatest: common.migrateLatest,
  truncateAll: truncateAll
};
