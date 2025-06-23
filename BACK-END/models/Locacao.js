const pool = require('../config/database');

class Locacao {
  static async buscarTodos() {
    try {
      console.log("Model: Executando query no banco...");
      const [results] = await pool.query(`
        SELECT 
          loc.cod_loc, 
          cli.nome, 
          loc.habilitacao_cliente, 
          loc.data_inicio, 
          loc.data_termino, 
          loc.situacao, 
          vec.modelo,
          vec.marca, 
          vec.placa
        FROM locacao loc
        JOIN veiculo vec ON vec.chassi = loc.chassi_veiculo
        JOIN cliente cli ON cli.habilitacao = loc.habilitacao_cliente
      `);
      
      console.log("Model: Resultados da query:", results.length);
      return results;
    } catch (err) {
      console.error("Model - Erro na query:", err);
      throw err;
    }
  }
}

module.exports = Locacao;