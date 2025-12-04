const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conectar ao banco de dados
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Função para inserir dados
function insertSampleData() {
  console.log('🌱 Inserindo dados de exemplo...');

  // Primeiro, vamos verificar se o usuário pedro.admin@teste.com existe
  db.get("SELECT id FROM users WHERE email = 'pedro.admin@teste.com'", (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return;
    }

    if (!user) {
      console.log('❌ Usuário pedro.admin@teste.com não encontrado');
      return;
    }

    const userId = user.id;
    console.log(`✅ Usuário encontrado com ID: ${userId}`);

    // Inserir pacientes
    const patients = [
      {
        name: 'Maria Silva',
        age: 28,
        email: 'maria@email.com',
        phone: '(11) 99999-1111',
        address: 'Rua das Flores, 123',
        emergencyContact: 'João Silva',
        emergencyPhone: '(11) 99999-2222',
        initialObservations: 'Paciente com ansiedade generalizada'
      },
      {
        name: 'João Santos',
        age: 35,
        email: 'joao@email.com',
        phone: '(11) 99999-3333',
        address: 'Av. Paulista, 456',
        emergencyContact: 'Ana Santos',
        emergencyPhone: '(11) 99999-4444',
        initialObservations: 'Paciente com depressão leve'
      },
      {
        name: 'Ana Costa',
        age: 42,
        email: 'ana@email.com',
        phone: '(11) 99999-5555',
        address: 'Rua Augusta, 789',
        emergencyContact: 'Carlos Costa',
        emergencyPhone: '(11) 99999-6666',
        initialObservations: 'Paciente com transtorno de pânico'
      }
    ];

    // Inserir pacientes
    const insertPatient = db.prepare(`
      INSERT INTO patients (userId, name, age, email, phone, address, emergencyContact, emergencyPhone, initialObservations, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ativo', ?, ?)
    `);

    const now = Date.now();
    const patientIds = [];

    patients.forEach((patient, index) => {
      insertPatient.run([
        userId,
        patient.name,
        patient.age,
        patient.email,
        patient.phone,
        patient.address,
        patient.emergencyContact,
        patient.emergencyPhone,
        patient.initialObservations,
        now,
        now
      ], function (err) {
        if (err) {
          console.error(`Erro ao inserir paciente ${patient.name}:`, err);
        } else {
          patientIds.push(this.lastID);
          console.log(`✅ Paciente ${patient.name} inserido com ID: ${this.lastID}`);
        }
      });
    });

    // Aguardar um pouco para os pacientes serem inseridos
    setTimeout(() => {
      // Inserir agendamentos
      const appointments = [
        {
          patientId: patientIds[0], // Maria Silva
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).getTime(), // Amanhã
          duration: 50,
          type: 'presencial',
          status: 'agendado',
          notes: 'Primeira consulta'
        },
        {
          patientId: patientIds[1], // João Santos
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).getTime(), // Depois de amanhã
          duration: 50,
          type: 'online',
          status: 'confirmado',
          notes: 'Consulta de acompanhamento'
        },
        {
          patientId: patientIds[2], // Ana Costa
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).getTime(), // Em 3 dias
          duration: 50,
          type: 'presencial',
          status: 'agendado',
          notes: 'Avaliação inicial'
        }
      ];

      const insertAppointment = db.prepare(`
        INSERT INTO appointments (userId, patientId, date, duration, type, status, notes, reminderSent, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
      `);

      appointments.forEach((appointment, index) => {
        insertAppointment.run([
          userId,
          appointment.patientId,
          appointment.date,
          appointment.duration,
          appointment.type,
          appointment.status,
          appointment.notes,
          now,
          now
        ], function (err) {
          if (err) {
            console.error(`Erro ao inserir agendamento ${index + 1}:`, err);
          } else {
            console.log(`✅ Agendamento ${index + 1} inserido com ID: ${this.lastID}`);
          }
        });
      });

      // Aguardar um pouco para os agendamentos serem inseridos
      setTimeout(() => {
        // Inserir sessões
        const sessions = [
          {
            patientId: patientIds[0], // Maria Silva
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).getTime(), // Ontem
            duration: 50,
            type: 'presencial',
            mood: 6,
            notes: 'Sessão de avaliação inicial. Paciente relatou sintomas de ansiedade generalizada.'
          },
          {
            patientId: patientIds[1], // João Santos
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).getTime(), // Há 2 dias
            duration: 50,
            type: 'online',
            mood: 7,
            notes: 'Sessão de acompanhamento. Paciente apresentou melhora nos sintomas de depressão.'
          }
        ];

        const insertSession = db.prepare(`
          INSERT INTO sessions (userId, patientId, date, duration, type, notes, mood, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        sessions.forEach((session, index) => {
          insertSession.run([
            userId,
            session.patientId,
            session.date,
            session.duration,
            session.type,
            session.notes,
            session.mood,
            now,
            now
          ], function (err) {
            if (err) {
              console.error(`Erro ao inserir sessão ${index + 1}:`, err);
            } else {
              console.log(`✅ Sessão ${index + 1} inserida com ID: ${this.lastID}`);
            }
          });
        });

        // Aguardar um pouco para as sessões serem inseridas
        setTimeout(() => {
          // Inserir pagamentos
          const payments = [
            {
              patientId: patientIds[0], // Maria Silva
              sessionId: 1, // Assumindo que a primeira sessão tem ID 1
              amount: 150.00,
              date: new Date(Date.now() - 24 * 60 * 60 * 1000).getTime(), // Ontem
              method: 'pix',
              status: 'pago',
              notes: 'Pagamento da primeira sessão'
            },
            {
              patientId: patientIds[1], // João Santos
              sessionId: 2, // Assumindo que a segunda sessão tem ID 2
              amount: 150.00,
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).getTime(), // Há 2 dias
              method: 'cartao',
              status: 'pendente',
              notes: 'Pagamento pendente'
            },
            {
              patientId: patientIds[2], // Ana Costa
              amount: 150.00,
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).getTime(), // Há 3 dias
              method: 'dinheiro',
              status: 'atrasado',
              notes: 'Pagamento em atraso'
            }
          ];

          const insertPayment = db.prepare(`
            INSERT INTO payments (userId, patientId, sessionId, amount, date, method, status, notes, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          payments.forEach((payment, index) => {
            insertPayment.run([
              userId,
              payment.patientId,
              payment.sessionId,
              payment.amount,
              payment.date,
              payment.method,
              payment.status,
              payment.notes,
              now,
              now
            ], function (err) {
              if (err) {
                console.error(`Erro ao inserir pagamento ${index + 1}:`, err);
              } else {
                console.log(`✅ Pagamento ${index + 1} inserido com ID: ${this.lastID}`);
              }
            });
          });

          // Finalizar
          setTimeout(() => {
            console.log('🎉 Dados de exemplo inseridos com sucesso!');
            console.log('📊 Resumo:');
            console.log('   - 3 Pacientes');
            console.log('   - 3 Agendamentos');
            console.log('   - 2 Sessões');
            console.log('   - 3 Pagamentos');
            console.log('');
            console.log('🔑 Credenciais para teste:');
            console.log('   Email: pedro.admin@teste.com');
            console.log('   Senha: 123456');

            db.close();
          }, 1000);

        }, 1000);

      }, 1000);

    }, 1000);

  });
}

// Executar
insertSampleData();

