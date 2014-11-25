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

      nick: "myUserNick"
    }
  },
  {
    "model": "Server",
    "data": {
      id: 2,
      name: 'BarServer',
      host: 'irc.bar.net',
      port: '6667',
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
    "model": "Channel",
    "data":{
      id: 2,
      name: "#otherserverchannel",

      server_id: 2
    }
  },

  {
    "model": "Message",
    "data": {
      id: 1,

      nick: "somenick",
      channel_id: 1,
      time: Date('2000-01-01T00:00:00'),

      contents: 'Hi!'
    }
  },
  {
    "model": "Message",
    "data": {
      id: 2,

      nick: "othernick",
      channel_id: 1,
      time: Date('2000-01-01T00:01:00'),

      contents: 'Hi, yourself!'
    }
  },
  {
    "model": "Message",
    "data": {
      id: 3,

      nick: "PersonOnOtherServer",
      channel_id: 2,
      time: Date('2000-01-01T00:01:00'),

      contents: 'No one can hear me!'
    }
  },
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
