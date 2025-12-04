exports.up = function (knex) {
  return knex.schema.createTable('patients', function (table) {
    table.increments('id').primary();
    table.integer('userId').unsigned().notNullable();
    table.string('name', 255).notNullable();
    table.integer('age').notNullable();
    table.string('email', 255).notNullable();
    table.string('phone', 20).notNullable();
    table.text('address').nullable();
    table.string('emergencyContact', 255).notNullable();
    table.string('emergencyPhone', 20).notNullable();
    table.text('healthHistory').nullable();
    table.text('initialObservations').nullable();
    table.enum('status', ['ativo', 'inativo', 'suspenso']).defaultTo('ativo');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    table.index(['userId']);
    table.index(['email']);
    table.index(['status']);
    table.unique(['userId', 'email']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('patients');
};
