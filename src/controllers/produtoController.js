const { Produto, Fornecedor } = require('../models');

// ─────────────────────────────────────────────
//  LISTAR produtos (pode filtrar por fornecedor)
// ─────────────────────────────────────────────
async function listar(req, res, next) {
  try {
    const where = {};
    if (req.query.fornecedor_id) where.fornecedor_id = req.query.fornecedor_id;

    const produtos = await Produto.findAll({
      where,
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: ['id', 'nome', 'categoria'] }],
      order: [['nome', 'ASC']],
    });
    res.json(produtos);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  BUSCAR produto por ID
// ─────────────────────────────────────────────
async function buscarPorId(req, res, next) {
  try {
    const produto = await Produto.findByPk(req.params.id, {
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: ['id', 'nome', 'categoria'] }],
    });

    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(produto);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  CRIAR produto
// ─────────────────────────────────────────────
async function criar(req, res, next) {
  try {
    const { nome, descricao, preco_custo, preco_venda, quantidade_estoque, estoque_minimo, fornecedor_id } = req.body;

    if (!nome || preco_custo === undefined || !fornecedor_id) {
      return res.status(400).json({ erro: 'Os campos nome, preco_custo e fornecedor_id são obrigatórios.' });
    }

    const fornecedor = await Fornecedor.findByPk(fornecedor_id);
    if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });

    const produto = await Produto.create({ nome, descricao, preco_custo, preco_venda, quantidade_estoque, estoque_minimo, fornecedor_id });
    res.status(201).json(produto);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  ATUALIZAR produto
// ─────────────────────────────────────────────
async function atualizar(req, res, next) {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });

    const { nome, descricao, preco_custo, preco_venda, quantidade_estoque, estoque_minimo } = req.body;
    await produto.update({ nome, descricao, preco_custo, preco_venda, quantidade_estoque, estoque_minimo });
    res.json(produto);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  EXCLUIR produto
// ─────────────────────────────────────────────
async function excluir(req, res, next) {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });

    await produto.destroy();
    res.json({ mensagem: 'Produto excluído com sucesso.' });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  LISTAR produtos com estoque baixo
// ─────────────────────────────────────────────
async function estoqueBaixo(req, res, next) {
  try {
    const { Op } = require('sequelize');
    const produtos = await Produto.findAll({
      where: {
        quantidade_estoque: { [Op.lte]: require('sequelize').col('estoque_minimo') },
      },
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: ['id', 'nome'] }],
    });
    res.json(produtos);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, estoqueBaixo };
