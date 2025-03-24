const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Invoice = require('../models/invoiceModel');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  invoiceId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Invoice, key: 'id' },
  },
  amountReceived: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  }
});

module.exports = Payment;
