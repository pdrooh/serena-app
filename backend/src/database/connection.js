const knex = require('knex');
const knexConfig = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

const db = knex(config);

// Testar conexão
db.raw('SELECT 1')
  .then(() => {
    console.log('✅ Conexão com banco de dados estabelecida');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar com banco de dados:', err);
    process.exit(1);
  });

module.exports = db;
