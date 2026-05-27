const { Documento, Fornecedor } = require('../models');
const { Op } = require('sequelize');

// ─────────────────────────────────────────────
//  LISTAR documentos (pode filtrar por fornecedor)
// ─────────────────────────────────────────────
async function listar(req, res, next) {
  try {
    const where = {};
    if (req.query.fornecedor_id) where.fornecedor_id = req.query.fornecedor_id;
    if (req.query.tipo) where.tipo = req.query.tipo;

    const documentos = await Documento.findAll({
      where,
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: ['id', 'nome'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(documentos);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  BUSCAR documento por ID
// ─────────────────────────────────────────────
async function buscarPorId(req, res, next) {
  try {
    const doc = await Documento.findByPk(req.params.id, {
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: ['id', 'nome'] }],
    });
    if (!doc) return res.status(404).json({ erro: 'Documento não encontrado.' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  CADASTRAR documento
// ─────────────────────────────────────────────
async function criar(req, res, next) {
  try {
    const { nome, tipo, caminho_arquivo, data_vencimento, fornecedor_id } = req.body;

    if (!nome || !fornecedor_id) {
      return res.status(400).json({ erro: 'Os campos nome e fornecedor_id são obrigatórios.' });
    }

    const fornecedor = await Fornecedor.findByPk(fornecedor_id);
    if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });

    const doc = await Documento.create({ nome, tipo, caminho_arquivo, data_vencimento, fornecedor_id });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  ATUALIZAR documento
// ─────────────────────────────────────────────
async function atualizar(req, res, next) {
  try {
    const doc = await Documento.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ erro: 'Documento não encontrado.' });

    const { nome, tipo, caminho_arquivo, data_vencimento } = req.body;
    await doc.update({ nome, tipo, caminho_arquivo, data_vencimento });
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  EXCLUIR documento
// ─────────────────────────────────────────────
async function excluir(req, res, next) {
  try {
    const doc = await Documento.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ erro: 'Documento não encontrado.' });

    await doc.destroy();
    res.json({ mensagem: 'Documento excluído com sucesso.' });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  DOCUMENTOS PRÓXIMOS DO VENCIMENTO
// ─────────────────────────────────────────────
async function proximosVencimento(req, res, next) {
  try {
    const dias = parseInt(req.query.dias) || 30;
    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + dias);

    const documentos = await Documento.findAll({
      where: {
        data_vencimento: { [Op.between]: [hoje, limite] },
      },
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: ['id', 'nome'] }],
      order: [['data_vencimento', 'ASC']],
    });
    res.json(documentos);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, proximosVencimento };
