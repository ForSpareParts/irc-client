// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite'
    },

    migrations: {
      tableName: 'sqlite3'
    },
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },

    migrations: {
      tableName: 'sqlite3'
    }
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite'
    },

    migrations: {
      tableName: 'sqlite3'
    }
  }

};