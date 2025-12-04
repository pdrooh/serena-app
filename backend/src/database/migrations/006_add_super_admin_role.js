exports.up = function (knex) {
  // SQLite não suporta MODIFY COLUMN, então precisamos recriar a tabela
  return knex.schema.hasTable('users').then(function(exists) {
    if (exists) {
      // Para SQLite, precisamos recriar a tabela
      if (knex.client.config.client === 'sqlite3') {
        return knex.schema.raw(`
          -- Criar tabela temporária com novo enum
          CREATE TABLE users_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'psychologist' CHECK(role IN ('psychologist', 'admin', 'super_admin')),
            isActive BOOLEAN DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
          );

          -- Copiar dados
          INSERT INTO users_new (id, name, email, password, role, isActive, createdAt, updatedAt)
          SELECT id, name, email, password, role, isActive, createdAt, updatedAt FROM users;

          -- Remover tabela antiga
          DROP TABLE users;

          -- Renomear tabela nova
          ALTER TABLE users_new RENAME TO users;

          -- Recriar índices
          CREATE INDEX users_email_idx ON users(email);
          CREATE INDEX users_role_idx ON users(role);
          CREATE INDEX users_isActive_idx ON users(isActive);
        `);
      } else {
        // Para PostgreSQL/MySQL
        return knex.schema.raw(`
          ALTER TABLE users
          MODIFY COLUMN role ENUM('psychologist', 'admin', 'super_admin')
          DEFAULT 'psychologist';
        `).catch(() => {
          // Se MODIFY COLUMN não funcionar, tentar ALTER TYPE (PostgreSQL)
          return knex.schema.raw(`
            ALTER TABLE users
            ALTER COLUMN role TYPE VARCHAR(20)
            CHECK (role IN ('psychologist', 'admin', 'super_admin'));
          `);
        });
      }
    }
  });
};

exports.down = function (knex) {
  // Reverter para enum original
  if (knex.client.config.client === 'sqlite3') {
    return knex.schema.raw(`
      CREATE TABLE users_old (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'psychologist' CHECK(role IN ('psychologist', 'admin')),
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO users_old (id, name, email, password, role, isActive, createdAt, updatedAt)
      SELECT id, name, email, password,
             CASE WHEN role = 'super_admin' THEN 'admin' ELSE role END as role,
             isActive, createdAt, updatedAt
      FROM users;

      DROP TABLE users;
      ALTER TABLE users_old RENAME TO users;

      CREATE INDEX users_email_idx ON users(email);
      CREATE INDEX users_role_idx ON users(role);
      CREATE INDEX users_isActive_idx ON users(isActive);
    `);
  } else {
    return knex.schema.raw(`
      ALTER TABLE users
      MODIFY COLUMN role ENUM('psychologist', 'admin')
      DEFAULT 'psychologist';
    `);
  }
};

