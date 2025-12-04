exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.enum('role', ['psychologist', 'admin']).defaultTo('psychologist');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    table.index(['email']);
    table.index(['role']);
    table.index(['isActive']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
