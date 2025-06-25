const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculo.js');


router.get('/veiculo', veiculoController.listar);

module.exports = router;