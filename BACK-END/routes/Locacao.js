const express = require('express');
const router = express.Router();
const locacaoController = require('../controllers/locacao');

router.get('/locacoes', locacaoController.listar);

module.exports = router;