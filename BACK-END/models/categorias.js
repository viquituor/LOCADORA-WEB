const pool = require('../config/database');

class categorias {

  static async buscarTodos() {
    try {
      const [results] = await pool.query(`SELECT 
    c.id_categoria,
    c.descricao,
    c.caracteristicas,
    c.preco_diaria,
    COUNT(DISTINCT v.chassi) AS total_veiculos,
    COUNT(DISTINCT CASE WHEN l.situacao = 'ENCERRADA' THEN l.cod_loc END) AS total_locacoes_encerradas,
    SUM(
        CASE WHEN l.situacao = 'ENCERRADA' THEN 
            (DATEDIFF(l.data_termino, l.data_inicio) + 1)
        ELSE 0 END
    ) AS total_dias_alugados,
    SUM(
        CASE WHEN l.situacao = 'ENCERRADA' THEN 
            (DATEDIFF(l.data_termino, l.data_inicio) + 1) * c.preco_diaria
        ELSE 0 END
    ) AS receita_total
FROM Categoria c
LEFT JOIN Veiculo v ON c.id_categoria = v.id_categoria
LEFT JOIN Locacao l ON v.chassi = l.chassi_veiculo
GROUP BY c.id_categoria, c.descricao, c.preco_diaria
ORDER BY receita_total DESC;`);
      return results;
    } catch (err) {
      console.error("Model - Erro na query:", err);
      throw err;
    }
  }
  static async addcat(dados) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const { descricao, preco_diaria, caracteristicas } = dados;
      const [results] = await connection.execute(`INSERT INTO categoria 
        (descricao, preco_diaria, caracteristicas) VALUES (?, ?, ?)`,
        [descricao, preco_diaria, caracteristicas]);
      await connection.commit();
      return results;
    } catch (err) {
      await connection.rollback();
      console.error("Model - Erro na query:", err);
      throw err;
    } finally {
      connection.release();
    }
  }
  static async delcat({ id_categoria }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Verifica se a categoria está associada a algum veículo
      const [veiculo] = await connection.query(
        `SELECT COUNT(*) AS total FROM veiculo WHERE id_categoria = ?`,
        [id_categoria]
      );

      if (veiculo[0].total > 0) {
        throw new Error("Não é possível excluir: categoria associada a veículos");
      }

      const [results] = await connection.query(
        `DELETE FROM categoria WHERE id_categoria = ?`,
        [id_categoria]
      );

      await connection.commit();
      return results;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}
module.exports = categorias;