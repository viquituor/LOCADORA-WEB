const categorias = require('../models/categorias.js');

exports.listar = async (req, res, next) => {
  try {
    const categoriasList = await categorias.buscarTodos();

    if (!categoriasList || categoriasList.length === 0) {
      return res.status(404).json({ message: 'Nenhuma categoria encontrada' });
    }

    res.status(200).json(categoriasList);
  } catch (err) {
    console.error("Controller - Erro ao buscar categorias:", err);
    next(err);
  }
};

exports.addcat = async (req, res, next) => {
  try {
    // Validação
    if (!req.body.descricao || !req.body.preco_diaria || !req.body.caracteristicas) {
      return res.status(400).json({ 
        success: false,
        error: "Campos obrigatórios faltando" 
      });
    }

    const result = await categorias.addcat(req.body);
    
    res.status(201).json({
      success: true,
      id: result.insertId,
      message: "Categoria cadastrada com sucesso!"
    });
    
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: "Categoria já cadastrada no sistema"
      });
    }
    next(err);
  }
};

exports.delcat = async (req, res, next) => {
  try {
    const { id_categoria } = req.params;
    const result = await categorias.delcat({ id_categoria });

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Categoria não encontrada ou associada a veículos" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoria excluída com sucesso!"
    });

  } catch (err) {
    next(err);
  }
};