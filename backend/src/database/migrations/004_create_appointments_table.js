exports.up = function (knex) {
  return knex.schema.createTable('appointments', function (table) {
    table.increments('id').primary();
    table.integer('userId').unsigned().notNullable();
    table.integer('patientId').unsigned().notNullable();
    table.datetime('date').notNullable();
    table.integer('duration').notNullable(); // em minutos
    table.enum('type', ['presencial', 'online']).notNullable();
    table.enum('status', ['agendado', 'confirmado', 'realizado', 'cancelado']).defaultTo('agendado');
    table.text('notes').nullable();
    table.boolean('reminderSent').defaultTo(false);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('patientId').references('id').inTable('patients').onDelete('CASCADE');
    table.index(['userId']);
    table.index(['patientId']);
    table.index(['date']);
    table.index(['status']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('appointments');
};
