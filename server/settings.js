module.exports = {
  //used to select a database configuration from knexfile.js
  databaseConfig: 'development',

  //used to switch between the real node-irc and the development mock
  ircLib: './mock-irc',

  //when false, disables logging of HTTP requests
  logRequests: true,

  //when false, do not attach to IRC server events, so that connections, joins,
  //messages, etc. do not result in any database access. This would break the
  //app in a realistic situation -- it's only used in testing so that we can
  //test the HTTP API without worrying cleaning up the non-blocking database
  //calls caused by the listener.
  listenToIRC: true
}
