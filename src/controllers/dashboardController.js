const { Fornecedor, Produto, Custo, Documento } = require('../models');
const { fn, col, literal, Op } = require('sequelize');

/**
 * GET /api/dashboard
 * Retorna métricas gerais do sistema para o dashboard.
 */
async function visaoGeral(req, res, next) {
  try {
    // Totais básicos
    const [
      totalFornecedores,
      fornecedoresAtivos,
      totalProdutos,
      totalDocumentos,
    ] = await Promise.all([
      Fornecedor.count(),
      Fornecedor.count({ where: { ativo: true } }),
      Produto.count(),
      Documento.count(),
    ]);

    // Somatório de custos
    const custos = await Custo.findAll({
      attributes: [
        'tipo',
        [fn('SUM', col('valor')), 'total'],
      ],
      group: ['tipo'],
      raw: true,
    });

    const totalEntradas = custos.find(c => c.tipo === 'entrada')?.total || 0;
    const totalSaidas   = custos.find(c => c.tipo === 'saida')?.total || 0;
    const saldo         = parseFloat(totalEntradas) - parseFloat(totalSaidas);

    // Fornecedores por categoria
    const porCategoria = await Fornecedor.findAll({
      attributes: ['categoria', [fn('COUNT', col('id')), 'quantidade']],
      group: ['categoria'],
      raw: true,
    });

    // Produtos com estoque baixo (quantidade <= estoque_minimo)
    const { sequelize } = require('../config/database');
    const estoqueBaixo = await Produto.count({
      where: literal('quantidade_estoque <= estoque_minimo'),
    });

    // Documentos vencendo nos próximos 30 dias
    const hoje   = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + 30);
    const docsVencendo = await Documento.count({
      where: { data_vencimento: { [Op.between]: [hoje, limite] } },
    });

    res.json({
      fornecedores: {
        total: totalFornecedores,
        ativos: fornecedoresAtivos,
        inativos: totalFornecedores - fornecedoresAtivos,
        por_categoria: porCategoria,
      },
      produtos: {
        total: totalProdutos,
        estoque_baixo: estoqueBaixo,
      },
      financeiro: {
        total_entradas: parseFloat(totalEntradas),
        total_saidas:   parseFloat(totalSaidas),
        saldo,
      },
      documentos: {
        total: totalDocumentos,
        vencendo_30_dias: docsVencendo,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/dashboard/lucro-por-categoria
 * Compara entradas vs saídas por categoria de fornecedor.
 */
async function lucroPorCategoria(req, res, next) {
  try {
    const { sequelize } = require('../config/database');

    const resultado = await Custo.findAll({
      attributes: [
        [col('fornecedor.categoria'), 'categoria'],
        'tipo',
        [fn('SUM', col('Custo.valor')), 'total'],
      ],
      include: [{ model: Fornecedor, as: 'fornecedor', attributes: [] }],
      group: ['fornecedor.categoria', 'Custo.tipo'],
      raw: true,
    });

    // Agrupar por categoria
    const mapa = {};
    for (const linha of resultado) {
      const cat = linha['categoria'] || 'Sem categoria';
      if (!mapa[cat]) mapa[cat] = { categoria: cat, entradas: 0, saidas: 0, saldo: 0 };
      if (linha.tipo === 'entrada') mapa[cat].entradas = parseFloat(linha.total);
      if (linha.tipo === 'saida')   mapa[cat].saidas   = parseFloat(linha.total);
    }

    const categorias = Object.values(mapa).map(c => ({
      ...c,
      saldo: c.entradas - c.saidas,
    }));

    res.json(categorias);
  } catch (err) {
    next(err);
  }
}

module.exports = { visaoGeral, lucroPorCategoria };
