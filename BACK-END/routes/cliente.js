const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.js');


router.get('/clientes', clienteController.listar);
router.post('/clientes', clienteController.addcli);
router.delete('/clientes/:habilitacao', clienteController.delcli);
module.exports = router;