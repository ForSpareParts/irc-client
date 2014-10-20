'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('server', function(table) {
    table.increments();
    table.string('name', 100);
    table.string('host');
    table.string('port', 10);
    table.string('nick', 30);

    table.unique(['host', 'port']);
  })

  .createTable('channel', function(table) {
    table.increments();
    table.string('name', 100);

    table.integer('server_id').references('server.id');
  })

  .createTable('message', function(table) {
    table.increments();
    table.string('nick', 30);
    table.string('contents', 512);
    table.dateTime('time');

    table.integer('channel_id').references('channel.id');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('server')
  .dropTable('channel')
  .dropTable('message')
};
