const express = require('express');
const router = express.Router();
const locacaoController = require('../controllers/locacao.js');

router.get('/locacoes', locacaoController.listar);
router.post('/locacoes', locacaoController.addLocacao);
router.put('/locacoes/encerrar', locacaoController.encerrarLocacao);
router.delete('/locacoes/:cod_loc', locacaoController.deletarLocacao);
router.put('/locacoes/:cod_loc', locacaoController.atualizarLocacao);

module.exports = router;