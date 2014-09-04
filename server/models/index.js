var bluebird = require('bluebird');

var common = require('./common')
  , Bookshelf = common.Bookshelf
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

//register all models with bookshelf so they can be referred to by name
Bookshelf.model('Channel', Channel);
Bookshelf.model('ChannelUser', ChannelUser);
Bookshelf.model('Message', Message);
Bookshelf.model('Server', Server);
Bookshelf.model('User', User);

module.exports = {
  Channel: require('./channel'),
  ChannelUser: require('./channel_user'),
  Message: require('./message'),
  Server: require('./server'),
  User: require('./user'),

  migrateLatest: common.migrateLatest,
  truncateAll: truncateAll
};
