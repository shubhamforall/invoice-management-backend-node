const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Customer = require('./customerModel');
const Vehicle = require('./vehicleModel');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Customer, key: 'id' },
  },
  vehicleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Vehicle, key: 'id' },
  },
  driverName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  loadingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deliveryAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Unpaid'),
    defaultValue: 'Unpaid',
  },
});

// Associations
Invoice.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Invoice, { foreignKey: 'customerId' });

Invoice.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Vehicle.hasMany(Invoice, { foreignKey: 'vehicleId' });

module.exports = Invoice;
