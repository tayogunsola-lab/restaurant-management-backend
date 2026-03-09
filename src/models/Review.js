const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  mealId: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('Pending','Approved','Declined'), defaultValue: 'Pending' },
}, {
  timestamps: true,
  tableName: 'reviews',
});

module.exports = Review;