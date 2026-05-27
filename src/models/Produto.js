const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Fornecedor = require('./Fornecedor');

/**
 * Modelo de Produto.
 * Um produto pertence a um fornecedor e possui controle de estoque.
 */
const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: { msg: 'O nome do produto não pode estar vazio.' } },
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preco_custo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  preco_venda: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  quantidade_estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  estoque_minimo: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  fornecedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'fornecedores', key: 'id' },
  },
}, {
  tableName: 'produtos',
  timestamps: true,
});

// Associações
Fornecedor.hasMany(Produto, { foreignKey: 'fornecedor_id', as: 'produtos' });
Produto.belongsTo(Fornecedor, { foreignKey: 'fornecedor_id', as: 'fornecedor' });

module.exports = Produto;
