const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Fornecedor = require('./Fornecedor');

/**
 * Modelo de Documento.
 * Armazena metadados de documentos vinculados a fornecedores.
 */
const Documento = sequelize.define('Documento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: { msg: 'O nome do documento é obrigatório.' } },
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Ex: contrato, nota_fiscal, certificado',
  },
  caminho_arquivo: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  data_vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  fornecedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'fornecedores', key: 'id' },
  },
}, {
  tableName: 'documentos',
  timestamps: true,
});

// Associações
Fornecedor.hasMany(Documento, { foreignKey: 'fornecedor_id', as: 'documentos' });
Documento.belongsTo(Fornecedor, { foreignKey: 'fornecedor_id', as: 'fornecedor' });

module.exports = Documento;
