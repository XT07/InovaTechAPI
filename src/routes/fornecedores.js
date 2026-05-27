const router = require('express').Router();
const ctrl   = require('../controllers/fornecedorController');

/**
 * @route   GET /api/fornecedores
 * @desc    Listar todos os fornecedores (suporta ?categoria=, ?ativo=, ?busca=)
 */
router.get('/', ctrl.listar);

/**
 * @route   GET /api/fornecedores/:id
 * @desc    Buscar fornecedor por ID (inclui produtos, custos e documentos)
 */
router.get('/:id', ctrl.buscarPorId);

/**
 * @route   POST /api/fornecedores
 * @desc    Cadastrar novo fornecedor
 * @body    { nome, categoria, cnpj?, email?, telefone?, endereco? }
 */
router.post('/', ctrl.criar);

/**
 * @route   PUT /api/fornecedores/:id
 * @desc    Atualizar fornecedor existente
 */
router.put('/:id', ctrl.atualizar);

/**
 * @route   DELETE /api/fornecedores/:id
 * @desc    Excluir fornecedor
 */
router.delete('/:id', ctrl.excluir);

module.exports = router;
