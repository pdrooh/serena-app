/**
 * Script simplificado para criar o primeiro usuário super_admin
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/database/connection');

async function createSuperAdmin() {
  const email = 'admin@serena.com';
  const password = 'admin123';
  const name = 'Super Admin';

  try {
    // Verificar se já existe
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      console.log('✅ Usuário já existe!');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);

      // Atualizar para super_admin se não for
      if (existingUser.role !== 'super_admin') {
        await db('users').where('id', existingUser.id).update({
          role: 'super_admin',
          updatedAt: new Date()
        });
        console.log('✅ Role atualizado para super_admin!');
      }
      process.exit(0);
    }

    // Hash da senha
    const saltRounds = 12;
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
    console.log(`   Senha: ${password}`);
    console.log(`   Role: super_admin`);
    console.log('\n📝 Use essas credenciais para fazer login:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário super_admin:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();

