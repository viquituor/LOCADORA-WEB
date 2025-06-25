const cliente = require('../models/cliente.js');

exports.listar = async (req, res, next) => {
  try {
    const clientes = await cliente.buscarTodos();
    
    if (!clientes || clientes.length === 0) {
      return res.status(404).json({ message: 'Nenhuma cliente encontrada' });
    }
    
    res.status(200).json(clientes);
  } catch (err) {
    console.error("Controller - Erro ao buscar clientes:", err);
    next(err);
  }
};

exports.addcli = async (req, res, next) => {
 try {
        // Validação
        if (!req.body.habilitacao || !req.body.nome || !req.body.data_nascimento || !req.body.endereco) {
            return res.status(400).json({ 
                success: false,
                error: "Campos obrigatórios faltando" 
            });
        }

        if (!req.body.habilitacao.match(/^\d{11}$/)) {
            return res.status(400).json({ 
                success: false,
                error: "Habilitação deve conter 11 números" 
            });
        }

        const result = await cliente.addcli(req.body);
        
        res.status(201).json({
            success: true,
            id: result.id,
            message: "Cliente cadastrado com sucesso!"
        });
        
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                error: "Habilitação já cadastrada no sistema"
            });
        }
        next(err);
    }
};

exports.delcli = async (req, res, next) => {
  try {
    const { habilitacao } = req.params;
    const result = await cliente.delcli({ habilitacao });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Cliente não encontrado" 
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Cliente excluído com sucesso"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

exports.editcli = async (req, res, next) => {
 try {
        const { habilitacao } = req.params;
        
        if (!req.body.habilitacao || !req.body.nome || !req.body.data_nascimento || !req.body.endereco) {
            return res.status(400).json({ 
                success: false,
                error: "Campos obrigatórios faltando" 
            });
        }

        if (!req.body.habilitacao.match(/^\d{11}$/)) {
            return res.status(400).json({ 
                success: false,
                error: "Habilitação deve conter 11 números" 
            });
        }

        const result = await cliente.editcli(req.body, habilitacao);
        
        res.status(201).json({
            success: true,
            id: result.id,
            message: "Cliente atualizado com sucesso!"
        });
        
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                error: "Habilitação já cadastrada no sistema"
            });
        }
        next(err);
    }
};
