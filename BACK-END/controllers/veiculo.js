const veiculo = require('../models/veiculo.js');

exports.listar = async (req, res, next) => {
  try {
    const veiculos = await veiculo.buscarTodos();
    
    if (!veiculos || veiculos.length === 0) {
      return res.status(404).json({ message: 'Nenhum veículo encontrado' });
    }

    res.status(200).json(veiculos);
  } catch (err) {
    console.error("Controller - Erro ao buscar veículos:", err);
    next(err);
  }
};

