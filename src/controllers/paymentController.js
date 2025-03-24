const Invoice = require('../models/invoiceModel');
const Customer = require('../models/customerModel');
const { applyFilters } = require("../utils/filterUtils");

exports.getCustomerPayments = async (req, res) => {
  try {
    const customerFilters = applyFilters(req.query, ["firstName", "lastName"]);
    const customers = await Customer.findAll({where: customerFilters });

    if (!customers.length) {
      return res.status(404).json({ message: 'No customers found' });
    }

    const paymentData = await Promise.all(customers.map(async (customer) => {

      const invoices = await Invoice.findAll({ where: { customerId: customer.id } });

      const totalInvoiced = invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0);

      const totalReceived = invoices
        .filter(invoice => invoice.status === 'Paid')
        .reduce((sum, invoice) => sum + (invoice.total || 0), 0);

      const pendingAmount = totalInvoiced - totalReceived;

      return {
        customerId: customer.id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        totalInvoiced,
        totalReceived,
        pendingAmount
      };
    }));

    res.status(200).json(paymentData);
  } catch (error) {
    console.error('Error fetching customer payments:', error);
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

