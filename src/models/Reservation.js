const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Reservation = sequelize.define('Reservation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  tableNumber: { type: DataTypes.INTEGER, allowNull: false },
  dateTime: { type: DataTypes.DATE, allowNull: false },
  status: { 
    type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),
    defaultValue: 'Pending'
  }
}, {
  timestamps: true,
  tableName: 'reservations',
});

module.exports = Reservation;