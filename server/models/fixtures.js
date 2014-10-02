var bluebird = require('bluebird');

var models = require('../models');

var fixtureData = [
  {
    "model": "Server",
    "data": {
      id: 1,
      name: 'FooServer',
      host: 'irc.foo.net',
      port: '6667',
      connected: true,

      connection_user_id: 3
    }
  },
  {
    "model": "Server",
    "data": {
      id: 2,
      name: 'BarServer',
      host: 'irc.bar.net',
      port: '6667',
      connected: false
    }
  },

  {
    "model": "Channel",
    "data":{
      id: 1,
      name: "#somechannel",

      server_id: 1
    }
  },

  {
    "model": "User",
    "data": {
      id: 1,
      nickname: "somenick",

      server_id: 1,
    }
  },
  {
    "model": "User",
    "data": {
      id: 2,
      nickname: "othernick",

      server_id: 1,
    }
  },
  {
    "model": "User",
    "data": {
      id: 3,
      nickname: "myUserNick",

      server_id: 1,
    }
  },

  {
    "model": "Message",
    "data": {
      id: 1,

      user_id: 1,
      channel_id: 1,
      time: Date('2000-01-01T00:00:00'),

      contents: 'Hi!'
    }
  },
  {
    "model": "Message",
    "data": {
      id: 2,

      user_id: 2,
      channel_id: 1,
      time: Date('2000-01-01T00:01:00'),

      contents: 'Hi, yourself!'
    }
  },
  {
    "model": "ChannelUser",
    "data": {
      id: 1,

      user_id: 1,
      channel_id: 1
    }
  },
  {
    "model": "ChannelUser",
    "data": {
      id: 2,

      user_id: 2,
      channel_id: 1
    }
  },
  {
    "model": "ChannelUser",
    "data": {
      id: 3,

      user_id: 3,
      channel_id: 1
    }
  }
];

/** Populate tables with fixture data. */
var loadAll = function() {
  promises = fixtureData.map(function(fixture){
    Model = models[fixture.model];
    return Model.create(fixture.data);
  });

  return bluebird.all(promises);
};

module.exports = {
  loadAll: loadAll
};
