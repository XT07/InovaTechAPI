const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo principal de Fornecedor.
 * Representa um fornecedor cadastrado no sistema INOVATECH.
 */
const Fornecedor = sequelize.define('Fornecedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: { msg: 'O nome não pode estar vazio.' } },
  },
  categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: { msg: 'A categoria não pode estar vazia.' } },
  },
  cnpj: {
    type: DataTypes.STRING(18),
    allowNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: { isEmail: { msg: 'E-mail inválido.' } },
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  endereco: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'fornecedores',
  timestamps: true,
});

module.exports = Fornecedor;
