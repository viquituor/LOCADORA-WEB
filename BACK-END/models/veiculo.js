const pool = require('../config/database');

class Veiculo {
    static async buscarTodos() {
    try {
      // Primeira query: Dados básicos dos veículos
      const [veiculos] = await pool.query(`
        SELECT 
          v.*,
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
        SUM((DATEDIFF(l.data_termino,l.data_inicio) + 1 ) * c.preco_diaria) AS receita_total
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

    static async addVeiculo(dados) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Verifica se a categoria existe antes de inserir
    const [categoria] = await connection.execute(
      'SELECT id_categoria FROM Categoria WHERE id_categoria = ?', 
      [dados.id_categoria]
    );
    
    if (categoria.length === 0) {
      throw { code: 'ER_NO_REFERENCED_ROW_2' };
    }

    const [results] = await connection.execute(
      `INSERT INTO Veiculo 
       (chassi, placa, marca, modelo, ano, cor, id_categoria) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.chassi, 
        dados.placa, 
        dados.marca, 
        dados.modelo, 
        dados.ano, 
        dados.cor, 
        dados.id_categoria
      ]
    );

    await connection.commit();
    return results;
  } catch (err) {
    await connection.rollback();
    console.error("Model - Erro ao adicionar veículo:", err);
    throw err;
  } finally {
    connection.release();
  }
    }

    static async delVeiculo({ chassi }) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const [results] = await connection.execute(`
                DELETE FROM Veiculo WHERE chassi = ?`,
                [chassi]);
            await connection.commit();
            return results;
        } catch (err) {
            await connection.rollback();
            console.error("Model - Erro ao deletar veículo:", err);
            throw err;
        } finally {
            connection.release();
        }
    }
    static async editVeiculo(dados, chassi) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            // Verifica se a categoria existe antes de atualizar
            const [categoria] = await connection.execute(
                'SELECT id_categoria FROM Categoria WHERE id_categoria = ?', 
                [dados.id_categoria]
            );
            
            if (categoria.length === 0) {
                throw { code: 'ER_NO_REFERENCED_ROW_2' };
            }

            const [results] = await connection.execute(`
                UPDATE Veiculo 
                SET placa = ?, marca = ?, modelo = ?, ano = ?, cor = ?, id_categoria = ? 
                WHERE chassi = ?`,
                [
                    dados.placa, 
                    dados.marca, 
                    dados.modelo, 
                    dados.ano, 
                    dados.cor, 
                    dados.id_categoria, 
                    chassi
                ]);
                
            await connection.commit();
            return results;
        } catch (err) {
            await connection.rollback();
            console.error("Model - Erro ao editar veículo:", err);
            throw err;
        } finally {
            connection.release();
        }
    }
}

module.exports = Veiculo;

