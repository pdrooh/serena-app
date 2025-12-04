require('dotenv').config();

module.exports = {
  development: {
    client: process.env.DB_CLIENT || 'sqlite3',
    connection: process.env.DB_CLIENT === 'postgresql' ? {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'serena_dev',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password'
    } : {
      filename: process.env.DB_FILENAME || './database.sqlite'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    useNullAsDefault: process.env.DB_CLIENT === 'sqlite3',
    pool: process.env.DB_CLIENT === 'postgresql' ? {
      min: 2,
      max: 10
    } : undefined
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    pool: {
      min: 2,
      max: 20
    }
  },

  // Fallback para SQLite se PostgreSQL não estiver disponível
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    useNullAsDefault: true
  }
};
