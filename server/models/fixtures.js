module.exports = [
  {
    "model": "Server",
    "data": {
      id: 1,
      name: 'FooServer',
      host: 'irc.foo.net',
      port: '6667',

      ConnectionUserId: 3
    }
  },
  {
    "model": "Server",
    "data": {
      id: 2,
      name: 'BarServer',
      host: 'irc.bar.net',
      port: '6667'
    }
  },

  {
    "model": "Channel",
    "data":{
      id: 1,
      name: "#somechannel",
      server: 1
    }
  },

  {
    "model": "User",
    "data": {
      id: 1,
      nickname: "somenick",
      server: 1,
      channels: [1]
    }
  },
  {
    "model": "User",
    "data": {
      id: 2,
      nickname: "othernick",
      server: 1,
      channels: [1]
    }
  },
  {
    "model": "User",
    "data": {
      id: 3,
      nickname: "myUserNick",
      server: 1,
      channels: [1]
    }
  },

  {
    "model": "Message",
    "data": {
      id: 1,
      user: 1,
      channel: 1,
      time: Date('2000-01-01T00:00:00'),

      message: 'Hi!'
    }
  },
  {
    "model": "Message",
    "data": {
      id: 2,
      user: 2,
      channel: 1,
      time: Date('2000-01-01T00:01:00'),

      message: 'Hi, yourself!'
    }
  },
];