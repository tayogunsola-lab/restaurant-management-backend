const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  customerName: { type: DataTypes.STRING, allowNull: false },
  total: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
  status: { 
    type: DataTypes.ENUM('Pending','Preparing','Delivered','Completed'), 
    defaultValue: 'Pending' 
  },
}, {
  timestamps: true,
  tableName: 'orders',
});

module.exports = Order;