/**
 * Script para criar o primeiro usuário super_admin
 *
 * Uso:
 * node scripts/create-super-admin.js <email> <senha> <nome>
 *
 * Exemplo:
 * node scripts/create-super-admin.js admin@serena.com admin123 "Super Admin"
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/database/connection');

async function createSuperAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.error('Uso: node scripts/create-super-admin.js <email> <senha> <nome>');
    process.exit(1);
  }

  const [email, password, name] = args;

  try {
    // Verificar se já existe um super_admin
    const existingSuperAdmin = await db('users')
      .where('role', 'super_admin')
      .first();

    if (existingSuperAdmin) {
      console.log('⚠️  Já existe um usuário super_admin no sistema.');
      console.log(`   Email: ${existingSuperAdmin.email}`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        readline.question('Deseja criar outro mesmo assim? (s/N): ', resolve);
      });

      readline.close();

      if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'sim') {
        console.log('Operação cancelada.');
        process.exit(0);
      }
    }

    // Verificar se email já existe
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      console.error(`❌ Erro: Email ${email} já está cadastrado.`);
      process.exit(1);
    }

    // Hash da senha
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário super_admin
    const [userId] = await db('users').insert({
      name,
      email,
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Usuário super_admin criado com sucesso!');
    console.log(`   ID: ${userId}`);
    console.log(`   Nome: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: super_admin`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário super_admin:', error);
    process.exit(1);
  }
}

createSuperAdmin();

