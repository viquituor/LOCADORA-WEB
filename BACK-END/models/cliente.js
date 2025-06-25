const pool = require('../config/database');

class cliente {

  static async buscarTodos() {
    try {
      const [results] = await pool.query(`SELECT * FROM cliente`);
      return results;
    } catch (err) {
      console.error("Model - Erro na query:", err);
      throw err;
    }
    };

  static async addcli(dados){
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const {nome, habilitacao, endereco, data_nascimento} = dados;
        const [results] = await connection.execute(`INSERT INTO cliente 
            (nome, habilitacao, endereco, data_nascimento) VALUES (?, ?, ?, ?)`,
            [nome, habilitacao, endereco, data_nascimento]);
            await connection.commit();
            return results;
  }catch(err){
    await connection.rollback();
    console.error("Model - Erro na query:", err);
    throw err;
      }finally{
        connection.release();
      }
    };

  static async delcli({ habilitacao }) { 
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const [locacao] = await connection.query(
      `SELECT COUNT(*) AS total FROM locacao WHERE habilitacao_cliente = ?`,
      [habilitacao] 
    );
    
    if (locacao[0].total > 0) {
      throw new Error("Não é possível excluir: cliente possui locações");
    }
    
    const [results] = await connection.query(
      `DELETE FROM cliente WHERE habilitacao = ?`,
      [habilitacao]
    );
    
    await connection.commit();
    return results;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
    };

  static async editcli(dados, habilitacaoAntiga){
      const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const {nome, habilitacao, endereco, data_nascimento} = dados;
    const [locacao] = await connection.query(
     `UPDATE cliente SET nome = ?, habilitacao = ? , endereco = ?, data_nascimento = ? 
      WHERE habilitacao = ?`,
      [nome, habilitacao, endereco, data_nascimento, habilitacaoAntiga] );
      await connection.commit();
      return { success: true, habilitacao: habilitacao };
            
  }catch(err){
      await connection.rollback();
      throw err;
    }finally{
      connection.release();
    }
    };

}
module.exports = cliente;