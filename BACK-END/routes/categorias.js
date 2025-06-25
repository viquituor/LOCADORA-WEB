const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.js');


router.get('/categorias', categoriasController.listar);
router.post('/categorias', categoriasController.addcat);
router.delete('/categorias/:id_categoria', categoriasController.delcat);

module.exports = router;