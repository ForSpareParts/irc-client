var bluebird = require('bluebird');

var settings = require('../settings');
var knexfile = require('../knexfile');

var knexSettings = knexfile[settings.databaseConfig];

//knex and bookshelf are initialized here
//to override database settings for testing, modify settings before loading
//this file
var knex = require('knex')(knexSettings);
var bookshelf = require('bookshelf')(knex);

/** A base class providing added functionality on top of bookshelf.Model. All
application models extend this class. */
var BaseModel = bookshelf.Model.extend({},
{

  /** Retrieve all records in the table. */
  all: function() {
    return this.collection().fetch();
  },

  /** Create a new record in the database, with props as properties. */
  create: function(props) {
    return this.forge(props).save(null, {method: 'insert'});
  },

  /** Destroy a single record, identified by id. */
  destroy: function(id) {
    if (typeof(search) === 'number') {
      //search is an id
      var id = search;
      return this.forge({id: id}).destroy();
    }
    else {
      //search is assumed to be a dictionary
      return this.forge(search).destroy();
    }
  },

  /** Retrieve a single record. search can be either an id or a dictionary of
  properties. */
  get: function(search) {
    if (typeof search === 'object') {
      //search is a dictionary
      return this.forge(search).fetch();
    }
    else {
      //search is assumed to be an id
      var id = search;
      return this.forge({id: id}).fetch();
    }
  },

});

/** Represents an IRC server. */
var Server = BaseModel.extend({
  tableName: 'server',

  //name (string)
  //host (string)
  //port (string)

  /** All known Channels on the Server. */
  channels: function() {
    return this.hasMany(Channel);
  },

  /** The User representing 'us' on the server. */
  connectionUser: function() {
    return this.belongsTo(User, 'connection_user_id');
  },

  /** All known Users on the server. */
  users: function() {
    return this.hasMany(User);
  }
});


/** Represents a user on a Server. The User representing us on a particular
Server is stored on the Server model as the connectionUser.*/
var User = BaseModel.extend({

  tableName: 'user',

  //nickname (string)

  /** The Server on which this User exists. */
  server: function() {
    return this.belongsTo(Server);
  },

  /** The Channels to which this User belongs. */
  channels: function () {
    return this.belongsToMany(Channel);
  }
});

/** Represents an IRC channel or direct-message conversation. */
var Channel = BaseModel.extend({
  tableName: 'channel',

  //name (string)

 /** The Server on which this Channel exists. */
  server: function() {
    return this.belongsTo(Server);
  },

  /** All Users currently in this Channel. */
  users: function () {
    return this.belongsToMany(User);
  },
  
  /** All Messages sent in this Channel. */
  messages: function() {
    return this.hasMany(Message);
  }
});

/** Represents records in the Channel<->User many-to-many relationship. Real
code will rarely use this model, but it's useful for fixture creation.*/
var ChannelUser = BaseModel.extend({
  tableName: 'channel_user',

  channel: function() {
    this.belongsTo(Channel);
  },

  user: function() {
    this.belongsTo(User);
  }
});

/** Represents a message in a Channel */
var Message = BaseModel.extend({

  tableName: 'message',

  // contents (string)
  // time (string, ISO-formatted -- SQLite doesn't have native DATETIME columns)

  /** The User who sent this Message. */
  user: function() {
    return this.belongsTo(User);
  },

  /** The Channel in which this Message was sent. */
  channel: function() {
    return this.belongsTo(Channel);
  }
});

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
  Channel: Channel,
  ChannelUser: ChannelUser,
  Message: Message,
  Server: Server,
  User: User,

  migrateLatest: migrateLatest,
  truncateAll: truncateAll
};
