var inflection = require('inflection');

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

/** A base class providing added functionality on top of Bookshelf.Model. All
application models extend this class. */
var BaseModel = Bookshelf.Model.extend(

  //instance methods
  {
    /** Returns Ember-compatible JSON representing the instance. */
    toEmber: function() {
      json = {};
      json[this.tableName] = this.toJSON();

      return json;
    }
  },

  //class methods
  {

    /** Returns Ember-compatible JSON representing this array of records. */
    toEmberArray: function(recordArray) {
      json = {};
      pluralName = inflection.pluralize(this.forge().tableName);

      json[pluralName] = []

      recordArray.each(function(record) {
        json[pluralName].push(record.toJSON());
      });

      return json;
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
      if (typeof(search) === 'number') {
        //search is an id
        var id = search;
        return this.forge({id: id}).destroy();
      }
      else {
        //search is assumed to be a dictionary
        return this.forge(search).destroy();
      }
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
