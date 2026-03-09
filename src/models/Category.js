const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
}, {
  timestamps: true,
  tableName: 'categories',
});

module.exports = Category;