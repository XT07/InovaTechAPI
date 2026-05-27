const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Fornecedor = require('./Fornecedor');

/**
 * Modelo de Custo.
 * Registra entradas e saídas financeiras vinculadas a um fornecedor.
 */
const Custo = sequelize.define('Custo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { notEmpty: { msg: 'A descrição é obrigatória.' } },
  },
  tipo: {
    type: DataTypes.ENUM('entrada', 'saida'),
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  data_custo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  fornecedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'fornecedores', key: 'id' },
  },
}, {
  tableName: 'custos',
  timestamps: true,
});

// Associações
Fornecedor.hasMany(Custo, { foreignKey: 'fornecedor_id', as: 'custos' });
Custo.belongsTo(Fornecedor, { foreignKey: 'fornecedor_id', as: 'fornecedor' });

module.exports = Custo;
