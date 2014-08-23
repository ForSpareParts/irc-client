var bluebird = require('bluebird');
var Sequelize = require('sequelize');
var sequelize_fixtures = require('sequelize-fixtures');

var fixtures = require('./fixtures');
var settings = require('../settings');

var sequelize = new Sequelize(
  settings.database.name,
  settings.database.user,
  settings.database.password,
  settings.database.options);

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
Server.hasMany(User, { as: 'users'});
Server.belongsTo(User, {
  as: 'connectionUser',
  foreignKey: 'ConnectionUserId',
  constraint: false });

User.belongsTo(Server, { as: 'server'});
User.hasMany(Channel, { as: 'channels', through: 'UserChannels' });

Channel.belongsTo(Server, { as: 'server'});
Channel.hasMany(User, { as: 'users', through: 'UserChannels'});
Channel.hasMany(Message, { as: 'messages'});

Message.belongsTo(Channel, { as: 'channel'});
Message.belongsTo(User, { as: 'user'});

var syncPromise = sequelize.sync();

var loadAllFixtures = function() {
  var models = {
    Server: Server,
    User: User,
    Channel: Channel,
    Message: Message
  };

  // build an array of all fixture-loading promises...
  promises = [];

  fixtures.forEach(function (fixture) {
    var model = models[fixture.model];
    var promise = model.create(fixture.data);

    promises.push(promise);
  });

  //...then return a promise that's fulfilled when they're all done
  return bluebird.all(promises);
};

module.exports = {
  Server: Server,
  User: User,
  Channel: Channel,
  Message: Message,

  loadAllFixtures: loadAllFixtures,
  syncPromise: syncPromise
};
