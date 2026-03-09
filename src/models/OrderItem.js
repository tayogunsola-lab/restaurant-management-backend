const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  mealId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, {
  timestamps: true,
  tableName: 'order_items',
});

module.exports = OrderItem;