const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'LOCADORA_WEB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar conexão ao iniciar
pool.getConnection()
  .then(conn => {
    console.log('Conexão com o banco de dados estabelecida!');
    conn.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  });

module.exports = pool;