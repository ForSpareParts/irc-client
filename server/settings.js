var noOpLogger = function (s) {
  return;
}

module.exports = {
  database: {
    name: "irc",
    user: "root",
    password: "toor",

    options: {
      // sqlite! now!
      dialect: 'sqlite',
     
      // the storage engine for sqlite
      // - default ':memory:'
      storage: './database.sqlite',

      logging: noOpLogger
    }
  }
}