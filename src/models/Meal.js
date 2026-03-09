const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Meal = sequelize.define('Meal', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.FLOAT, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
}, {
  timestamps: true,
  tableName: 'meals',
});

module.exports = Meal;