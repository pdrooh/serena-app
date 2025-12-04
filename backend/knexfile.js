require('dotenv').config();

// Suporte para variáveis do Railway (PGHOST, PGPORT, etc.) e variáveis customizadas (DB_HOST, etc.)
const getDbConfig = () => {
  // Railway usa PGHOST, PGPORT, etc. - priorizar essas variáveis
  const host = process.env.PGHOST || process.env.DB_HOST;
  const port = process.env.PGPORT || process.env.DB_PORT || 5432;
  const database = process.env.PGDATABASE || process.env.DB_NAME;
  const user = process.env.PGUSER || process.env.DB_USER;
  const password = process.env.PGPASSWORD || process.env.DB_PASSWORD;
  
  return {
    host,
    port: parseInt(port, 10),
    database,
    user,
    password,
    ssl: process.env.DB_SSL === 'true' || process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false
  };
};

module.exports = {
  development: {
    client: process.env.DB_CLIENT || 'sqlite3',
    connection: process.env.DB_CLIENT === 'postgresql' ? getDbConfig() : {
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
    connection: getDbConfig(),
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
