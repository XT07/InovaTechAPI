const router = require('express').Router();
const ctrl   = require('../controllers/custoController');

/**
 * @route   GET /api/custos
 * @desc    Listar custos (?fornecedor_id=, ?tipo=entrada|saida, ?data_inicio=, ?data_fim=)
 */
router.get('/', ctrl.listar);

/**
 * @route   GET /api/custos/resumo
 * @desc    Resumo financeiro agrupado por fornecedor e tipo
 */
router.get('/resumo', ctrl.resumoFinanceiro);

/**
 * @route   GET /api/custos/:id
 */
router.get('/:id', ctrl.buscarPorId);

/**
 * @route   POST /api/custos
 * @body    { descricao, tipo: 'entrada'|'saida', valor, data_custo?, fornecedor_id }
 */
router.post('/', ctrl.criar);

/**
 * @route   PUT /api/custos/:id
 */
router.put('/:id', ctrl.atualizar);

/**
 * @route   DELETE /api/custos/:id
 */
router.delete('/:id', ctrl.excluir);

module.exports = router;
