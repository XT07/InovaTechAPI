const { Custo, Fornecedor } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// ─────────────────────────────────────────────
//  LISTAR custos (pode filtrar por fornecedor e tipo)
// ─────────────────────────────────────────────
async function listar(req, res, next) {
  try {
    const where = {};
    if (req.query.fornecedor_id) where.fornecedor_id = req.query.fornecedor_id;
    if (req.query.tipo) where.tipo = req.query.tipo;
    if (req.query.data_inicio && req.query.data_fim) {
      where.data_custo = { [Op.between]: [req.query.data_inicio, req.query.data_fim] };
    }

    const custos = await Custo.findAll({
      where,
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: ['id', 'nome', 'categoria'] }],
      order: [['data_custo', 'DESC']],
    });
    res.json(custos);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  BUSCAR custo por ID
// ─────────────────────────────────────────────
async function buscarPorId(req, res, next) {
  try {
    const custo = await Custo.findByPk(req.params.id, {
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: ['id', 'nome'] }],
    });
    if (!custo) return res.status(404).json({ erro: 'Custo não encontrado.' });
    res.json(custo);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  REGISTRAR custo
// ─────────────────────────────────────────────
async function criar(req, res, next) {
  try {
    const { descricao, tipo, valor, data_custo, fornecedor_id } = req.body;

    if (!descricao || !tipo || valor === undefined || !fornecedor_id) {
      return res.status(400).json({ erro: 'Os campos descricao, tipo, valor e fornecedor_id são obrigatórios.' });
    }

    if (!['entrada', 'saida'].includes(tipo)) {
      return res.status(400).json({ erro: 'O campo tipo deve ser "entrada" ou "saida".' });
    }

    const fornecedor = await Fornecedor.findByPk(fornecedor_id);
    if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });

    const custo = await Custo.create({ descricao, tipo, valor, data_custo, fornecedor_id });
    res.status(201).json(custo);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  ATUALIZAR custo
// ─────────────────────────────────────────────
async function atualizar(req, res, next) {
  try {
    const custo = await Custo.findByPk(req.params.id);
    if (!custo) return res.status(404).json({ erro: 'Custo não encontrado.' });

    const { descricao, tipo, valor, data_custo } = req.body;

    if (tipo && !['entrada', 'saida'].includes(tipo)) {
      return res.status(400).json({ erro: 'O campo tipo deve ser "entrada" ou "saida".' });
    }

    await custo.update({ descricao, tipo, valor, data_custo });
    res.json(custo);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  EXCLUIR custo
// ─────────────────────────────────────────────
async function excluir(req, res, next) {
  try {
    const custo = await Custo.findByPk(req.params.id);
    if (!custo) return res.status(404).json({ erro: 'Custo não encontrado.' });

    await custo.destroy();
    res.json({ mensagem: 'Custo excluído com sucesso.' });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  RESUMO FINANCEIRO por fornecedor
// ─────────────────────────────────────────────
async function resumoFinanceiro(req, res, next) {
  try {
    const { sequelize } = require('../config/database');

    const resumo = await Custo.findAll({
      attributes: [
        'fornecedor_id',
        'tipo',
        [fn('SUM', col('valor')), 'total'],
        [fn('COUNT', col('id')), 'quantidade'],
      ],
      group: ['fornecedor_id', 'tipo'],
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: ['id', 'nome', 'categoria'] }],
    });

    res.json(resumo);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, resumoFinanceiro };
