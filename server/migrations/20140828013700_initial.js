'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('server', function(table) {
    table.increments();
    table.string('name', 100);
    table.string('host');
    table.string('port', 10);
    table.boolean('connected');

    table.unique(['host', 'port']);
    table.integer('connection_user_id').references('user.id');
  })

  .createTable('user', function(table) {
    table.increments();
    table.string('nickname', 50);

    table.integer('server_id').references('server.id');
  })

  .createTable('channel', function(table) {
    table.increments();
    table.string('name', 100);

    table.integer('server_id').references('server.id');
  })

  .createTable('message', function(table) {
    table.increments();
    table.string('contents', 512);
    table.dateTime('time');

    table.integer('user_id').references('user.id');
    table.integer('channel_id').references('channel.id');
  })

  .createTable('channel_user', function(table) {
    table.increments();
    table.integer('channel_id').references('channel.id');
    table.integer('user_id').references('user.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('server')
  .dropTable('user')
  .dropTable('channel')
  .dropTable('message')
  .dropTable('channel_user');
};
