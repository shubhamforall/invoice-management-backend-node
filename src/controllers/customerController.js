const  Customer  = require('../models/customerModel');
const { applyFilters } = require("../utils/filterUtils");

exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const filters = applyFilters(req.query, ["firstName", "lastName", "email","address"]);
    const customers = await Customer.findAll({ where: filters });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.update(req.body); // 🚀 Only updates provided fields
    res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};
