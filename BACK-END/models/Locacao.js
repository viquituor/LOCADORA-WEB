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

  static async adicionar(chassi, habilitacao_cliente, data_inicio) {
    try {
      console.log("Model: Inserindo nova locação...");
      const [result] = await pool.query(`
        INSERT INTO locacao (chassi_veiculo, habilitacao_cliente, data_inicio)
        VALUES (?, ?, ?)
      `, [chassi, habilitacao_cliente, data_inicio]);
      
      console.log("Model: Locações inserida com sucesso:", result.insertId);
      return { cod_loc: result.insertId, chassi_veiculo: chassi, habilitacao_cliente, data_inicio };
    } catch (err) {
      console.error("Model - Erro ao inserir locação:", err);
      throw err;
    }
  }

  static async encerrar(cod_loc, data_termino) {
    try {
      console.log("Model: Encerrando locação...");
      const [result] = await pool.query(`
        UPDATE locacao
        SET data_termino = ?, situacao = 'Finalizada'
        WHERE cod_loc = ?
      `, [data_termino, cod_loc]);
      
      if (result.affectedRows === 0) {
        console.warn("Model: Nenhuma locação encontrada para encerrar com cod_loc:", cod_loc);
        return null;
      }
      
      console.log("Model: Locação encerrada com sucesso:", cod_loc);
      return { cod_loc, data_termino, situacao: 'Finalizada' };
    } catch (err) {
      console.error("Model - Erro ao encerrar locação:", err);
      throw err;
    }
  }
}

module.exports = Locacao;