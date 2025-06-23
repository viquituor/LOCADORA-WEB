const Locacao = require('../models/locacao');

exports.listar = async (req, res, next) => {
  try {
    console.log("Controller: Buscando locações...");
    const locacoes = await Locacao.buscarTodos();
    
    if (!locacoes || locacoes.length === 0) {
      return res.status(404).json({ message: 'Nenhuma locação encontrada' });
    }
    
    console.log("Controller: Locações encontradas:", locacoes.length);
    res.status(200).json(locacoes);
  } catch (err) {
    console.error("Controller - Erro ao buscar locações:", err);
    next(err);
  }
};