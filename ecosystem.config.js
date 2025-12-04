module.exports = {
  apps: [{
    name: 'serena-backend',
    script: 'src/server.js',
    cwd: './backend',
    instances: 2, // ou 'max' para usar todos os CPUs
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // Restart se usar mais de 1GB de memória
  }]
};

