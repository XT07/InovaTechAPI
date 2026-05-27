const { Fornecedor, Produto, Custo, Documento } = require('../models');

// ─────────────────────────────────────────────
//  LISTAR todos os fornecedores
// ─────────────────────────────────────────────
async function listar(req, res, next) {
  try {
    const { categoria, ativo, busca } = req.query;
    const where = {};

    if (categoria) where.categoria = categoria;
    if (ativo !== undefined) where.ativo = ativo === 'true';
    if (busca) {
      const { Op } = require('sequelize');
      where.nome = { [Op.like]: `%${busca}%` };
    }

    const fornecedores = await Fornecedor.findAll({ where, order: [['nome', 'ASC']] });
    res.json(fornecedores);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  BUSCAR um fornecedor pelo ID (com detalhes)
// ─────────────────────────────────────────────
async function buscarPorId(req, res, next) {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id, {
      include: [
        { model: Produto,   as: 'produtos'   },
        { model: Custo,     as: 'custos'     },
        { model: Documento, as: 'documentos' },
      ],
    });

    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
    }

    res.json(fornecedor);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  CRIAR fornecedor
// ─────────────────────────────────────────────
async function criar(req, res, next) {
  try {
    const { nome, categoria, cnpj, email, telefone, endereco } = req.body;

    if (!nome || !categoria) {
      return res.status(400).json({ erro: 'Os campos nome e categoria são obrigatórios.' });
    }

    const fornecedor = await Fornecedor.create({ nome, categoria, cnpj, email, telefone, endereco });
    res.status(201).json(fornecedor);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  ATUALIZAR fornecedor
// ─────────────────────────────────────────────
async function atualizar(req, res, next) {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);

    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
    }

    const { nome, categoria, cnpj, email, telefone, endereco, ativo } = req.body;
    await fornecedor.update({ nome, categoria, cnpj, email, telefone, endereco, ativo });
    res.json(fornecedor);
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────
//  EXCLUIR fornecedor
// ─────────────────────────────────────────────
async function excluir(req, res, next) {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);

    if (!fornecedor) {
      return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
    }

    await fornecedor.destroy();
    res.json({ mensagem: 'Fornecedor excluído com sucesso.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
