module.exports = {
  //used to select a database configuration from knexfile.js
  databaseConfig: 'development',

  //used to switch between the real node-irc and the development mock
  ircLib: 'mock',

  //when false, disables logging of HTTP requests
  logRequests: true
}
