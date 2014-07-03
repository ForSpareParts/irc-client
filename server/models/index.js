var Sequelize = require('sequelize');
var fixtures = require('./fixtures');

var sequelize = new Sequelize('irc', 'root', 'toor', {
  // sqlite! now!
  dialect: 'sqlite',
 
  // the storage engine for sqlite
  // - default ':memory:'
  storage: './database.sqlite'
});

//in Sequelize, we have to define relationships after declaring the tables
//for readability, I've made commented notes about the relationships in each
//table declaration.


var Server = sequelize.define('Server', {
  name: Sequelize.STRING,
  host: Sequelize.STRING,
  port: Sequelize.STRING

  //channels: all known Channels on the Server
  //connectionUser: the User representing 'us' on the server
  //users: all known Users on the server
});

var User = sequelize.define('User', {
  nickname: Sequelize.STRING,

  //server: the Server on which this User exists
  //channels: the Channels to which this User belongs
});

var Channel = sequelize.define('Channel', {
  name: Sequelize.STRING,

  //server: the Server on which this Channel exists
  //users: all Users currently in this Channel
  //messages: all Messages sent in this channel
});

var Message = sequelize.define('Message', {
  message: Sequelize.STRING,
  time: Sequelize.DATE

  //user: the User who sent this Message
  //channel: the Channel in which this Message was sent
});

Server.hasMany(Channel, { as: 'channels'});
Server.hasOne(User, { as: 'connectionUser'});
Server.hasMany(User, { as: 'users'});

User.hasMany(Channel, { as: 'channels' });

Channel.hasMany(User, { as: 'users'});
Channel.hasMany(Message, { as: 'messages'});

Message.belongsTo(User, { as: 'user'});

var syncPromise = sequelize.sync();

var loadAllFixtures = function() {
  return Server.bulkCreate(fixtures.servers).then(function() {
    return Channel.bulkCreate(fixtures.channels);
  }).then(function() {
    return User.bulkCreate(fixtures.users);
  }).then(function() {
    return Message.bulkCreate(fixtures.messages);
  });
};

module.exports = {
  Server: Server,
  User: User,
  Channel: Channel,
  Message: Message,

  loadAllFixtures: loadAllFixtures,
  syncPromise: syncPromise
};
