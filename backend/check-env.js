#!/usr/bin/env node

/**
 * Script para verificar se todas as variáveis de ambiente necessárias estão configuradas
 * Execute: node check-env.js
 */

require('dotenv').config();

const requiredVars = {
  // Variáveis obrigatórias
  'NODE_ENV': process.env.NODE_ENV,
  'PORT': process.env.PORT,
  'DB_CLIENT': process.env.DB_CLIENT,
  'JWT_SECRET': process.env.JWT_SECRET,
  
  // Variáveis do PostgreSQL (Railway)
  'PGHOST': process.env.PGHOST || process.env.DB_HOST,
  'PGDATABASE': process.env.PGDATABASE || process.env.DB_NAME,
  'PGUSER': process.env.PGUSER || process.env.DB_USER,
  'PGPASSWORD': process.env.PGPASSWORD || process.env.DB_PASSWORD,
};

const optionalVars = {
  'CORS_ORIGIN': process.env.CORS_ORIGIN,
  'DB_SSL': process.env.DB_SSL,
  'RATE_LIMIT_WINDOW_MS': process.env.RATE_LIMIT_WINDOW_MS,
  'RATE_LIMIT_MAX_REQUESTS': process.env.RATE_LIMIT_MAX_REQUESTS,
};

console.log('\n🔍 Verificando variáveis de ambiente...\n');

let hasErrors = false;
let hasWarnings = false;

// Verificar variáveis obrigatórias
console.log('📋 Variáveis Obrigatórias:');
Object.entries(requiredVars).forEach(([key, value]) => {
  if (value) {
    const displayValue = key.includes('PASSWORD') || key === 'JWT_SECRET' 
      ? '***' 
      : value;
    console.log(`   ✅ ${key}: ${displayValue}`);
  } else {
    console.log(`   ❌ ${key}: NÃO DEFINIDO`);
    hasErrors = true;
  }
});

// Verificar variáveis opcionais
console.log('\n📋 Variáveis Opcionais:');
Object.entries(optionalVars).forEach(([key, value]) => {
  if (value) {
    console.log(`   ✅ ${key}: ${value}`);
  } else {
    console.log(`   ⚠️  ${key}: não definida (opcional)`);
    hasWarnings = true;
  }
});

// Verificar se está usando variáveis do Railway
console.log('\n🔗 Variáveis do PostgreSQL:');
if (process.env.PGHOST) {
  console.log('   ✅ Usando variáveis do Railway (PGHOST, PGPORT, etc.)');
} else if (process.env.DB_HOST) {
  console.log('   ⚠️  Usando variáveis customizadas (DB_HOST, DB_PORT, etc.)');
  console.log('   💡 Recomendado: Conecte o PostgreSQL ao backend no Railway para usar PGHOST');
} else {
  console.log('   ❌ Nenhuma variável de banco de dados encontrada!');
  hasErrors = true;
}

// Resumo
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ ERRO: Algumas variáveis obrigatórias estão faltando!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. No Railway, vá no serviço do BACKEND');
  console.log('   2. Clique em "Variables"');
  console.log('   3. Adicione as variáveis que estão faltando');
  console.log('   4. Conecte o PostgreSQL usando "Add Reference"');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  AVISO: Algumas variáveis opcionais não estão definidas');
  console.log('   O sistema deve funcionar, mas algumas funcionalidades podem estar limitadas.');
  process.exit(0);
} else {
  console.log('✅ Todas as variáveis estão configuradas corretamente!');
  process.exit(0);
}

