var inflection = require('inflection');
var _ = require('underscore');

//this module provides core functionality for models -- exposing, among other
//things, the application's bookshelf and knex instances

var settings = require('../settings');
var knexfile = require('../knexfile');

var knexSettings = knexfile[settings.databaseConfig];

//knex and bookshelf are initialized here
//to override database settings for testing, modify settings before loading
//this file
var knex = require('knex')(knexSettings);
var Bookshelf = require('bookshelf')(knex);

//activate the registry plugin to help us resolve circular model dependencies
Bookshelf.plugin('registry');

//activate the virtuals plugin to create the 'links' property where necessary
Bookshelf.plugin('virtuals');


/** A base class providing added functionality on top of Bookshelf.Model. All
application models extend this class. */
var BaseModel = Bookshelf.Model.extend(

  //instance methods
  {
    /** Return Ember-compatible object representing the instance. */
    toEmber: function() {
      var emberObject = {};
      emberObject[this.tableName] = this.constructor.foreignKeysToEmber(
        this.toJSON());

      return emberObject;
    },

  },

  //class methods
  {
    //array of foreign keys on this model -- e.g. ['server', 'channel']
    //OMIT the trailing _id on the database column
    foerignKeys: null,

    /**
     * Return the name of the database table this model represents.
     *
     * This is really just a proxy for the tableName property on the instance,
     * which for some reason is not available on the class.
     * @type {string}
     */
    tableName: function() {
      return this.forge().tableName;
    },

    /**
     * Take a JSON-serializable object representing a single record, and
     * return a copy with any foreign keys converted from Bookshelf (_id) format
     * to Ember (sans _id) format.
     * @param {Object} [obj]
     * @return {Object} [description]
     */
    foreignKeysToEmber: function(obj) {
      var clone = JSON.parse(JSON.stringify(obj));

      if (this.foreignKeys) {
        //strip _id off of the names of foreign keys so Ember recognizes them,
        //e.g. convert server_id: 1 to server: 1
        this.foreignKeys.forEach(function(key) {
          if (clone[key + "_id"]) {
            var temp = clone[key + "_id"];
            delete clone[key + "_id"];

            clone[key] = temp;
          }
        });
      }

      return clone;
    },

    /**
     * Take a JSON-serializable object representing a single record, and return
     * a copy with any foreign keys converted from Ember format to Bookshelf
     * format (the reverse of foreignKeysToEmber()).
     * @param  {Object} obj [description]
     * @return {Object}     [description]
     */
    foreignKeysToBookshelf: function(obj) {
      var clone = JSON.parse(JSON.stringify(obj));

      if (this.foreignKeys) {
        this.foreignKeys.forEach(function(key) {
          if (clone[key]) {
            var temp = clone[key];
            delete clone[key];

            clone[key + "_id"] = temp;
          }
        });
      }

      return clone;
    },

    /** Take Ember-compatible object and return a record. */
    fromEmber: function(emberObject) {
      return this.forge(
        this.foreignKeysToBookshelf(emberObject[this.tableName()]));
    },

    /** Take Ember-compatible object containing an array and return an array of
    records. */
    fromEmberArray: function(emberObject) {
      var self = this;
      var pluralName = inflection.pluralize(self.forge().tableName);
      return emberObject[pluralName].map(function (serialized) {
        return self.forge(self.foreignKeysToBookshelf(serialized));
      });
    },

    /** Return Ember-compatible object representing this array of records. */
    toEmberArray: function(recordArray) {
      var self = this;
      var emberObject = {};
      var pluralName = inflection.pluralize(this.forge().tableName);

      emberObject[pluralName] = _.map(recordArray, function(record) {
        return self.foreignKeysToEmber(record.toJSON());
      });

      return emberObject;
    },

    /** Retrieve all records in the table. */
    all: function() {
      return this.collection().fetch();
    },

    /** Create a new record in the database, with props as properties. */
    create: function(props) {
      return this.forge(props).save(null, {method: 'insert'});
    },

    /** Destroy a single record, identified by id. */
    destroy: function(id) {
      return this.forge({id: id}).destroy();
    },

    /** Retrieve a single record. search can be either an id or a dictionary of
    properties. */
    get: function(search) {
      if (typeof search === 'object') {
        //search is a dictionary
        return this.forge(search).fetch({require: true});
      }
      else {
        //search is assumed to be an id
        var id = search;
        return this.forge({id: id}).fetch({require: true});
      }
    },

    /** Retrieves a record with the properties in search if one exists; if not,
    creates such a record. */
    getOrCreate: function(search) {
      var self = this;

      return this.get(search)

      .catch(this.NotFoundError, function() {
        return self.create(search);
      });
    }

  }
);

/** Update the current database to the most recent migration. */
var migrateLatest = function() {
  return knex.migrate.latest();
}

module.exports = {
  BaseModel: BaseModel,
  Bookshelf: Bookshelf,
  knex: knex,
  migrateLatest: migrateLatest
};
