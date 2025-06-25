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

exports.addVeiculo = async (req, res, next) => {
  try {
    // Validação completa dos campos
    const requiredFields = ['chassi', 'placa', 'marca', 'modelo', 'ano', 'cor', 'id_categoria'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: `Campos obrigatórios faltando: ${missingFields.join(', ')}`,
        fields: missingFields
      });
    }

    // Validação específica do chassi (17 caracteres)
    if (req.body.chassi.length !== 17) {
      return res.status(400).json({
        success: false,
        error: "Chassi deve ter exatamente 17 caracteres",
        field: "chassi"
      });
    }

    // Validação da placa (7 caracteres)
    if (req.body.placa.length !== 7) {
      return res.status(400).json({
        success: false,
        error: "Placa deve ter exatamente 7 caracteres",
        field: "placa"
      });
    }

    // Formatar dados antes de inserir
    const veiculoData = {
      chassi: req.body.chassi.toUpperCase(), // Padroniza chassi em maiúsculas
      placa: req.body.placa.toUpperCase().replace(/-/g, ''), // Remove hífens e padroniza
      marca: req.body.marca.trim(),
      modelo: req.body.modelo.trim(),
      ano: req.body.ano.toString().substring(0, 4), // Garante apenas 4 dígitos
      cor: req.body.cor.trim(),
      id_categoria: parseInt(req.body.id_categoria)
    };

    const result = await veiculo.addVeiculo(veiculoData);
    
    res.status(201).json({
      success: true,
      data: {
        chassi: veiculoData.chassi,
        placa: veiculoData.placa
      },
      message: "Veículo cadastrado com sucesso!"
    });
    
  } catch (err) {
    // Tratamento específico para erros conhecidos
    if (err.code === 'ER_DUP_ENTRY') {
      const errorMessage = err.sqlMessage.includes('chassi') ? 
        "Chassi já cadastrado no sistema" : 
        "Placa já cadastrada no sistema";
      
      return res.status(409).json({
        success: false,
        error: errorMessage,
        field: err.sqlMessage.includes('chassi') ? 'chassi' : 'placa'
      });
    }

    // Erros de chave estrangeira (categoria não existe)
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        error: "Categoria selecionada não existe",
        field: "id_categoria"
      });
    }

    console.error("Controller - Erro ao adicionar veículo:", err);
    next(err);
  }
};

exports.delVeiculo = async (req, res, next) => {
  try {
    const { chassi } = req.params;
    const result = await veiculo.delVeiculo({ chassi });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Veículo não encontrado" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Veículo deletado com sucesso!"
    });
    
  } catch (err) {
    console.error("Controller - Erro ao deletar veículo:", err);
    next(err);
  }
};

exports.editVeiculo = async (req, res, next) => {
  try {
    const { chassi } = req.params;
    const veiculoData = req.body;

    // Validação dos campos obrigatórios
    if (!veiculoData.placa || !veiculoData.marca || !veiculoData.modelo || !veiculoData.ano || !veiculoData.cor || !veiculoData.id_categoria) {
      return res.status(400).json({ 
        success: false,
        error: "Campos obrigatórios faltando" 
      });
    }

    // Formatar dados antes de atualizar
    veiculoData.placa = veiculoData.placa.toUpperCase().replace(/-/g, '');
    veiculoData.chassi = chassi.toUpperCase();
    veiculoData.ano = veiculoData.ano.toString().substring(0, 4);
    
    const result = await veiculo.editVeiculo(veiculoData, chassi);
    
    res.status(200).json({
      success: true,
      message: "Veículo atualizado com sucesso!",
      data: result
    });
    
  } catch (err) {
    console.error("Controller - Erro ao editar veículo:", err);
    next(err);
  }
};  

