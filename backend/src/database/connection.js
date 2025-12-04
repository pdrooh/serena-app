const knex = require('knex');
const knexConfig = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
console.log(`📦 Ambiente: ${environment}`);

const config = knexConfig[environment];

if (!config) {
  console.error(`❌ Configuração não encontrada para ambiente: ${environment}`);
  process.exit(1);
}

const db = knex(config);

// Testar conexão
db.raw('SELECT 1')
  .then(() => {
    console.log('✅ Conexão com banco de dados estabelecida');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar com banco de dados:');
    console.error(`   Código: ${err.code}`);
    console.error(`   Mensagem: ${err.message}`);
    console.error(`   Host tentado: ${config.connection?.host || 'N/A'}`);
    console.error(`   Porta tentada: ${config.connection?.port || 'N/A'}`);
    console.error('\n💡 Verifique:');
    console.error('   1. Se o PostgreSQL está conectado ao serviço no Railway');
    console.error('   2. Se as variáveis PGHOST, PGDATABASE, PGUSER, PGPASSWORD estão definidas');
    console.error('   3. Se NODE_ENV=production está configurado');
    process.exit(1);
  });

module.exports = db;
