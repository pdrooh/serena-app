exports.up = function (knex) {
  return knex.schema.createTable('payments', function (table) {
    table.increments('id').primary();
    table.integer('userId').unsigned().notNullable();
    table.integer('patientId').unsigned().notNullable();
    table.integer('sessionId').unsigned().nullable();
    table.decimal('amount', 10, 2).notNullable();
    table.date('date').notNullable();
    table.enum('method', ['pix', 'dinheiro', 'cartao', 'transferencia']).notNullable();
    table.enum('status', ['pendente', 'pago', 'atrasado']).defaultTo('pendente');
    table.string('receiptUrl', 255).nullable();
    table.text('notes').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('patientId').references('id').inTable('patients').onDelete('CASCADE');
    table.foreign('sessionId').references('id').inTable('sessions').onDelete('SET NULL');
    table.index(['userId']);
    table.index(['patientId']);
    table.index(['sessionId']);
    table.index(['date']);
    table.index(['status']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('payments');
};
