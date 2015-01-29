var _ = require('underscore');
var argv = require('yargs').argv;

var defaults = {
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
  listenToIRC: true,

  //when true, enable routes at /dev, allowing a client to migrate, truncate,
  //or wipe the database, or load test fixtures. Allows the Ember tests to reset
  //the app like the backend tests do.
  enableDevRoutes: false,
};


var profiles = {
  dev: {}, //dev is just the default profile,
  test: {
    databaseConfig: 'test',
    listenToIRC: false,
    enableDevRoutes: true,
    logRequests: false
  },

  production: {
    databaseConfig: 'production',
    ircLib: 'irc',
    enableDevRoutes: false
  }
};


//Get settings for a given profile name (defaults to 'dev').
if (argv.settings === undefined) {
  argv.settings = 'dev';
}

var settings = _.clone(defaults);

if (profiles[argv.settings]) {
  _.extend(settings, profiles[argv.settings]);
}

module.exports = settings;
