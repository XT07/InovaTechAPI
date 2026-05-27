const router = require('express').Router();
const ctrl   = require('../controllers/produtoController');

/**
 * @route   GET /api/produtos
 * @desc    Listar produtos (?fornecedor_id=)
 */
router.get('/', ctrl.listar);

/**
 * @route   GET /api/produtos/estoque-baixo
 * @desc    Listar produtos com estoque abaixo do mínimo
 */
router.get('/estoque-baixo', ctrl.estoqueBaixo);

/**
 * @route   GET /api/produtos/:id
 */
router.get('/:id', ctrl.buscarPorId);

/**
 * @route   POST /api/produtos
 * @body    { nome, descricao?, preco_custo, preco_venda?, quantidade_estoque?, estoque_minimo?, fornecedor_id }
 */
router.post('/', ctrl.criar);

/**
 * @route   PUT /api/produtos/:id
 */
router.put('/:id', ctrl.atualizar);

/**
 * @route   DELETE /api/produtos/:id
 */
router.delete('/:id', ctrl.excluir);

module.exports = router;
