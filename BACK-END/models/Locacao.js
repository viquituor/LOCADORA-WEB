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
        SET data_termino = ?, situacao = 'ENCERRADA'
        WHERE cod_loc = ?
      `, [data_termino, cod_loc]);
      
      if (result.affectedRows === 0) {
        console.warn("Model: Nenhuma locação encontrada para encerrar com cod_loc:", cod_loc);
        return null;
      }
      
      console.log("Model: Locação encerrada com sucesso:", cod_loc);
      return { cod_loc, data_termino, situacao: 'ENCERRADA' };
    } catch (err) {
      console.error("Model - Erro ao encerrar locação:", err);
      throw err;
    }
  }

  static async deletar(cod_loc) {
    try {
      console.log("Model: Deletando locação...");
      const [result] = await pool.query(`
        DELETE FROM locacao
        WHERE cod_loc = ?
      `, [cod_loc]);
      
      if (result.affectedRows === 0) {
        console.warn("Model: Nenhuma locação encontrada para deletar com cod_loc:", cod_loc);
        return null;
      }
      
      console.log("Model: Locações deletada com sucesso:", cod_loc);
      return { cod_loc };
    } catch (err) {
      console.error("Model - Erro ao deletar locação:", err);
      throw err;
    }
  }

  static async atualizar(cod_loc, dados) {
  try {
    console.log("Model: Atualizando locação...");
    const { chassi_veiculo, habilitacao_cliente, data_inicio, data_termino, situacao } = dados;
    
    const [result] = await pool.query(`
      UPDATE locacao
      SET 
        chassi_veiculo = ?, 
        habilitacao_cliente = ?, 
        data_inicio = ?, 
        data_termino = ?
      WHERE cod_loc = ?
    `, [chassi_veiculo, habilitacao_cliente, data_inicio, data_termino, cod_loc]);
    
    if (result.affectedRows === 0) {
      console.warn("Model: Nenhuma locação encontrada para atualizar com cod_loc:", cod_loc);
      return null;
    }

    if(situacao === 'ENCERRADA' && !data_termino) {
      console.warn("Model: Data de término é obrigatória para locações encerradas.");
      throw new Error("Data de término é obrigatória para locações encerradas.");
    }
    if(situacao === 'EM ABERTO') {
      const [resultSituacao] = await pool.query(`
        UPDATE locacao
        SET situacao = 'Em ABERTO', data_termino = NULL
        WHERE cod_loc = ?
      `, [cod_loc]);
      data_termino = null;
    }
    
    // Retornar os dados atualizados, mostrando "Em aberto" se data_termino for null
    const locacaoAtualizada = {
      cod_loc,
      chassi_veiculo,
      habilitacao_cliente,
      data_inicio,
      data_termino: data_termino || 'Em aberto',
      situacao
    };
    
    console.log("Model: Locações atualizada com sucesso:", locacaoAtualizada);
    return locacaoAtualizada;
  } catch (err) {
    console.error("Model - Erro ao atualizar locação:", err);
    throw err;
  }
}
}

module.exports = Locacao;