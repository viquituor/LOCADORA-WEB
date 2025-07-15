const Locacao = require('../models/Locacao.js');

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

exports.addLocacao = async (req, res, next) => {
  try {
    const { chassi, habilitacao_cliente, data_inicio } = req.body;

    if (!chassi || !habilitacao_cliente || !data_inicio) {
      return res.status(400).json({ message: 'Dados incompletos para locação' });
    }

    const novaLocacao = await Locacao.adicionar(chassi, habilitacao_cliente, data_inicio);
    res.status(201).json(novaLocacao);
  } catch (err) {
    if (err.message.includes('Veículo já está em uma locação ativa')) {
      return res.status(400).json({ message: err.message });
    }
    console.error("Controller - Erro ao adicionar locação:", err);
    next(err);
  }
};

exports.encerrarLocacao = async (req, res, next) => {
  try {
    const { cod_loc, data_termino } = req.body;

    if (!cod_loc || !data_termino) {
      return res.status(400).json({ message: 'Dados incompletos para encerrar locação' });
    }

    const locacaoEncerrada = await Locacao.encerrar(cod_loc, data_termino);
    if (!locacaoEncerrada) {
      return res.status(400).json({ message: 'Locação não encontrada, já encerrada ou não está aberta' });
    }
    
    res.status(200).json(locacaoEncerrada);
  } catch (err) {
    if (err.message.includes('Locação já está encerrada')) {
      return res.status(400).json({ message: err.message });
    }
    console.error("Controller - Erro ao encerrar locação:", err);
    next(err);
  }
};

exports.deletarLocacao = async (req, res, next) => {
  try {
    console.log("Controller: Deletando locação...");
    const { cod_loc } = req.params;
    const locacaoDeletada = await Locacao.deletar(cod_loc);

    if (!locacaoDeletada) {
      return res.status(404).json({ message: 'Locação não encontrada' });
    }

    console.log("Controller: Locação deletada com sucesso:", locacaoDeletada);
    res.status(200).json(locacaoDeletada);
  } catch (err) {
    console.error("Controller - Erro ao deletar locação:", err);
    next(err);
  }
};

exports.atualizarLocacao = async (req, res, next) => {
  try {
    const { cod_loc } = req.params;
    const { chassi_veiculo, habilitacao_cliente, data_inicio, data_termino, situacao } = req.body;

    if (!cod_loc || !chassi_veiculo || !habilitacao_cliente || !data_inicio || !situacao) {
      return res.status(400).json({ message: 'Dados incompletos para atualizar locação' });
    }

    const locacaoAtualizada = await Locacao.atualizar(cod_loc, {
      chassi_veiculo,
      habilitacao_cliente,
      data_inicio,
      data_termino,
      situacao
    });

    if (!locacaoAtualizada) {
      return res.status(404).json({ message: 'Locação não encontrada' });
    }

    res.status(200).json(locacaoAtualizada);
  } catch (err) {
    if (err.message.includes('Não é possível reabrir') || 
        err.message.includes('já está em uma locação ativa') ||
        err.message.includes('Data de término é obrigatória')) {
      return res.status(400).json({ message: err.message });
    }
    console.error("Controller - Erro ao atualizar locação:", err);
    next(err);
  }
};
