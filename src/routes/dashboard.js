const router = require('express').Router();
const ctrl   = require('../controllers/dashboardController');

/**
 * @route   GET /api/dashboard
 * @desc    Visão geral com métricas do sistema
 */
router.get('/', ctrl.visaoGeral);

/**
 * @route   GET /api/dashboard/lucro-por-categoria
 * @desc    Comparativo de entradas vs saídas por categoria de fornecedor
 */
router.get('/lucro-por-categoria', ctrl.lucroPorCategoria);

module.exports = router;
