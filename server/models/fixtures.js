module.exports = {

  servers: [
    {
      id: 1,
      name: 'FooServer',
      host: 'irc.foo.net',
      port: '6667',

      connectionUser: 3
    },
    {
      id: 2,
      name: 'BarServer',
      host: 'irc.bar.net',
      port: '6667'
    }
  ],

  users: [
    {
      id: 1,
      nickname: "somenick",
      server: 1,
      channels: [1]
    },
    {
      id: 2,
      nickname: "othernick",
      server: 1,
      channels: [1]
    },
    {
      id: 3,
      nickname: "myUserNick",
      server: 1,
      channels: [1]
    }
  ],

  channels: [
    {
      id: 1,
      name: "#somechannel",
      server: 1,

      users: [1, 2],
      messages: [1, 2]
    }
  ],

  messages: [
    {
      id: 1,
      user: 1,
      channel: 1,
      time: Date('2000-01-01T00:00:00'),

      message: 'Hi!'
    },
    {
      id: 2,
      user: 2,
      channel: 1,
      time: Date('2000-01-01T00:01:00'),

      message: 'Hi, yourself!'
    },
  ]

};