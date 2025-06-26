const Locacao = require('../models/locacao.js');

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
    console.log("Controller: Adicionando nova locação...");
    const { chassi, habilitacao_cliente, data_inicio } = req.body;

    if (!chassi || !habilitacao_cliente || !data_inicio) {
      return res.status(400).json({ message: 'Dados incompletos para locação' });
    }

    const novaLocacao = await Locacao.adicionar(chassi, habilitacao_cliente, data_inicio);
    if (!novaLocacao) {
      return res.status(500).json({ message: 'Erro ao adicionar locação' });
    }
    console.log("Controller: Locações adicionada com sucesso:", novaLocacao);
    res.status(201).json(novaLocacao);
  } catch (err) {
    console.error("Controller - Erro ao adicionar locação:", err);
    next(err);
  }
};

exports.encerrarLocacao = async (req, res, next) => {
  try {
    console.log("Controller: Encerrando locação...");
    const { cod_loc, data_termino } = req.body;

    if (!cod_loc || !data_termino) {
      return res.status(400).json({ message: 'Dados incompletos para encerrar locação' });
    }

    const locacaoEncerrada = await Locacao.encerrar(cod_loc, data_termino);
    if (!locacaoEncerrada) {
      return res.status(404).json({ message: 'Locação não encontrada ou já encerrada' });
    }
    
    console.log("Controller: Locação encerrada com sucesso:", locacaoEncerrada);
    res.status(200).json(locacaoEncerrada);
  } catch (err) {
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
    console.log("Controller: Atualizando locação...");
    const { cod_loc } = req.params;
    const { chassi_veiculo, habilitacao_cliente, data_inicio, data_termino, situacao } = req.body;

    if (!cod_loc || !chassi_veiculo || !habilitacao_cliente || !data_inicio || !situacao) {
      return res.status(400).json({ message: 'Dados incompletos para atualizar locação' });
    }

    // Validação adicional para data_termino quando situacao for "Finalizada"
    if (situacao === 'Finalizada' && !data_termino) {
      return res.status(400).json({ message: 'Data de término é obrigatória para locações finalizadas' });
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

    console.log("Controller: Locação atualizada com sucesso:", locacaoAtualizada);
    res.status(200).json(locacaoAtualizada);
  } catch (err) {
    console.error("Controller - Erro ao atualizar locação:", err);
    next(err);
  }
};
