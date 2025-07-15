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
          vec.placa,
          loc.chassi_veiculo
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
    // Verificar disponibilidade do veículo
    const veiculoDisponivel = await this.verificarVeiculoDisponivel(chassi);
    if (!veiculoDisponivel) {
      throw new Error('Veículo já está em uma locação ativa');
    }

    console.log("Model: Inserindo nova locação...");
    const [result] = await pool.query(`
      INSERT INTO locacao (chassi_veiculo, habilitacao_cliente, data_inicio, situacao)
      VALUES (?, ?, ?, 'EM ABERTO')
    `, [chassi, habilitacao_cliente, data_inicio]);
    
    console.log("Model: Locação inserida com sucesso:", result.insertId);
    return { 
      cod_loc: result.insertId, 
      chassi_veiculo: chassi, 
      habilitacao_cliente, 
      data_inicio,
      situacao: 'EM ABERTO'
    };
  } catch (err) {
    console.error("Model - Erro ao inserir locação:", err);
    throw err;
  }
  }

  static async encerrar(cod_loc, data_termino) {
  try {
    // Verificar se a locação está aberta
    const locacaoAberta = await this.verificarLocacaoAberta(cod_loc);
    if (!locacaoAberta) {
      throw new Error('Locação já está encerrada ou não existe');
    }

    console.log("Model: Encerrando locação...");
    const [result] = await pool.query(`
      UPDATE locacao
      SET data_termino = ?, situacao = 'ENCERRADA'
      WHERE cod_loc = ? AND situacao = 'EM ABERTO'
    `, [data_termino, cod_loc]);
    
    if (result.affectedRows === 0) {
      console.warn("Model: Nenhuma locação aberta encontrada para encerrar com cod_loc:", cod_loc);
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
    const { chassi_veiculo, habilitacao_cliente, data_inicio, data_termino, situacao } = dados;
    
    // Verificar se a locação existe
    const [currentLoc] = await pool.query('SELECT * FROM locacao WHERE cod_loc = ?', [cod_loc]);
    if (currentLoc.length === 0) {
      return null;
    }

    // Verificar se está tentando mudar para EM ABERTO uma locação ENCERRADA
    if (currentLoc[0].situacao === 'ENCERRADA' && situacao === 'EM ABERTO') {
      throw new Error('Não é possível reabrir uma locação encerrada');
    }

    // Verificar disponibilidade do veículo se estiver mudando o veículo ou situação
    if (currentLoc[0].chassi_veiculo !== chassi_veiculo || 
        (currentLoc[0].situacao !== situacao && situacao === 'EM ABERTO')) {
      const veiculoDisponivel = await this.verificarVeiculoDisponivel(chassi_veiculo);
      if (!veiculoDisponivel) {
        throw new Error('Veículo já está em uma locação ativa');
      }
    }

    // Se mudando para ENCERRADA, verificar data_termino
    if (situacao === 'ENCERRADA' && !data_termino) {
      throw new Error('Data de término é obrigatória para locações encerradas');
    }

    // Atualização principal
    const [result] = await pool.query(`
      UPDATE locacao
      SET 
        chassi_veiculo = ?, 
        habilitacao_cliente = ?, 
        data_inicio = ?, 
        data_termino = ?,
        situacao = ?
      WHERE cod_loc = ?
    `, [
      chassi_veiculo, 
      habilitacao_cliente, 
      data_inicio, 
      situacao === 'EM ABERTO' ? null : data_termino,
      situacao,
      cod_loc
    ]);
    
    if (result.affectedRows === 0) {
      return null;
    }

    return {
      cod_loc,
      chassi_veiculo,
      habilitacao_cliente,
      data_inicio,
      data_termino: situacao === 'EM ABERTO' ? null : data_termino,
      situacao
    };
  } catch (err) {
    console.error("Model - Erro ao atualizar locação:", err);
    throw err;
  }
  }

  static async verificarVeiculoDisponivel(chassi) {
  try {
    const [results] = await pool.query(`
      SELECT cod_loc FROM locacao 
      WHERE chassi_veiculo = ? AND situacao = 'EM ABERTO'
    `, [chassi]);
    
    return results.length === 0; // Retorna true se o veículo estiver disponível
  } catch (err) {
    console.error("Erro ao verificar disponibilidade do veículo:", err);
    throw err;
  }
  }

  static async verificarLocacaoAberta(cod_loc) {
  try {
    const [results] = await pool.query(`
      SELECT cod_loc FROM locacao 
      WHERE cod_loc = ? AND situacao = 'EM ABERTO'
    `, [cod_loc]);
    
    return results.length > 0; // Retorna true se a locação estiver aberta
  } catch (err) {
    console.error("Erro ao verificar status da locação:", err);
    throw err;
  }
  }

}
module.exports = Locacao;