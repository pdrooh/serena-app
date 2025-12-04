exports.up = function (knex) {
  return knex.schema.createTable('sessions', function (table) {
    table.increments('id').primary();
    table.integer('userId').unsigned().notNullable();
    table.integer('patientId').unsigned().notNullable();
    table.date('date').notNullable();
    table.integer('duration').notNullable(); // em minutos
    table.enum('type', ['presencial', 'online']).notNullable();
    table.text('notes').nullable();
    table.string('audioRecording', 255).nullable();
    table.json('attachments').nullable(); // array de arquivos
    table.integer('mood').notNullable(); // 1-10
    table.json('objectives').nullable(); // array de objetivos
    table.json('techniques').nullable(); // array de técnicas
    table.text('nextSessionGoals').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('patientId').references('id').inTable('patients').onDelete('CASCADE');
    table.index(['userId']);
    table.index(['patientId']);
    table.index(['date']);
    table.index(['type']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('sessions');
};
