const router = require('express').Router();
const ctrl   = require('../controllers/documentoController');

/**
 * @route   GET /api/documentos
 * @desc    Listar documentos (?fornecedor_id=, ?tipo=)
 */
router.get('/', ctrl.listar);

/**
 * @route   GET /api/documentos/vencimentos
 * @desc    Documentos próximos do vencimento (?dias=30)
 */
router.get('/vencimentos', ctrl.proximosVencimento);

/**
 * @route   GET /api/documentos/:id
 */
router.get('/:id', ctrl.buscarPorId);

/**
 * @route   POST /api/documentos
 * @body    { nome, tipo?, caminho_arquivo?, data_vencimento?, fornecedor_id }
 */
router.post('/', ctrl.criar);

/**
 * @route   PUT /api/documentos/:id
 */
router.put('/:id', ctrl.atualizar);

/**
 * @route   DELETE /api/documentos/:id
 */
router.delete('/:id', ctrl.excluir);

module.exports = router;
