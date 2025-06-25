const pool = require('../config/database');

class Veiculo {
  static async buscarTodos() {
    try {
      // Primeira query: Dados básicos dos veículos
      const [veiculos] = await pool.query(`
        SELECT 
          v.chassi,
          v.placa,
          v.marca,
          v.modelo,
          v.ano,
          v.cor,
          c.id_categoria,
          c.descricao AS categoria,
          c.preco_diaria
        FROM Veiculo v
        JOIN Categoria c ON v.id_categoria = c.id_categoria
      `);

      // Segunda query: Receita total por veículo
      const [receitas] = await pool.query(`
        SELECT 
        l.chassi_veiculo,
        SUM(DATEDIFF(l.data_termino,l.data_inicio) * c.preco_diaria) AS receita_total
        FROM Locacao l
        JOIN Veiculo v ON l.chassi_veiculo = v.chassi
        JOIN Categoria c ON v.id_categoria = c.id_categoria
        WHERE l.situacao = 'ENCERRADA'
        GROUP BY l.chassi_veiculo
      `);

      // Cria mapa de receitas para lookup rápido
      const receitaMap = receitas.reduce((map, item) => {
        map[item.chassi_veiculo] = item.receita_total;
        return map;
      }, {});

      // Combina os resultados
      return veiculos.map(veiculo => ({
        ...veiculo,
        receita_total: receitaMap[veiculo.chassi] || 0
      }));

    } catch (err) {
      console.error("Model - Erro ao buscar veículos com receita:", err);
      throw err;
    }
  }
}

module.exports = Veiculo;

