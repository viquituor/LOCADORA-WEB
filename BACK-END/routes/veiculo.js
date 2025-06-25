const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculo.js');


router.get('/veiculo', veiculoController.listar);
router.post('/veiculo', veiculoController.addVeiculo);
router.delete('/veiculo/:chassi', veiculoController.delVeiculo);
router.put('/veiculo/:chassi', veiculoController.editVeiculo);

module.exports = router;