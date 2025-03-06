const Invoice = require('../models/invoiceModel');
const Customer = require('../models/customerModel');
const Vehicle = require('../models/vehicleModel');
const generateInvoice = require('../services/generateInvoice');
const sendInvoiceEmail = require('../services/emailService');

exports.createInvoice = async (req, res) => {
    try {
        const { customerId, vehicleId, driverName, date, loadingAddress, deliveryAddress, weight, rate } = req.body;

        // Validate Customer
        const customer = await Customer.findByPk(customerId);
        if (!customer) {
            return res.status(400).json({ message: 'Invalid customer. Customer does not exist.' });
        }

        // Validate Vehicle
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(400).json({ message: 'Invalid vehicle. Vehicle does not exist.' });
        }

        // **Ensure `weight` and `rate` are valid before calculating total**
        if (!weight || !rate) {
            return res.status(400).json({ message: 'Weight and rate must be provided and greater than zero.' });
        }

        // **Calculate Total**
        const total = parseFloat(weight) * parseFloat(rate); // Ensure numeric conversion

        // **Create Invoice**
        const invoice = await Invoice.create({
            customerId, 
            vehicleId, 
            driverName, 
            date, 
            loadingAddress,
            deliveryAddress, 
            weight, 
            rate, 
            total, 
            status: 'Unpaid'
        });

        const invoiceData = {
            invoiceNumber: invoice.id,
            date: invoice.date,
            status: invoice.status,
            customerName: `${customer.firstName} ${customer.lastName}`,
            customerEmail: customer.email,
            customerAddress: customer.address,
            customerMobile: customer.mobileNo,
            vehicle: vehicle.vehicleName,
            driverName: invoice.driverName,
            loadingAddress: invoice.loadingAddress,
            deliveryAddress: invoice.deliveryAddress,
            weight: invoice.weight,
            rate: invoice.rate,
            total: invoice.total
        };

        // **Generate Invoice PDF**
        const pdfPath = await generateInvoice(invoiceData);

        // **Send Invoice via Email**
        await sendInvoiceEmail(customer.email, pdfPath);

        res.status(201).json({ message: 'Invoice created and sent via email', invoice });
    } catch (error) {
        console.error("Invoice creation error:", error); // Debugging log
        res.status(500).json({ message: 'Error creating invoice', error });
    }
};


// **Get All Invoices**
exports.getAllInvoices = async (req, res) => {
    try {
        const filters = applyFilters(req.query, ["status"]);
        const dateFilter = applyDateRangeFilter(req.query, "date");
        const invoices = await Invoice.findAll({
            where: { ...filters, ...dateFilter },
            include: [
                { model: Customer, attributes: ['firstName', 'lastName', 'email', 'address'] },
                { model: Vehicle, attributes: ['vehicleName', 'vehicleNumber', 'vehicleType', 'modelYear', 'color'] }
            ]
        });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error });
    }
};

// **Get Invoice By ID**
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id, {
            include: [
                { model: Customer, attributes: ['firstName', 'lastName', 'email', 'address'] },
                { model: Vehicle, attributes: ['vehicleName', 'vehicleNumber', 'vehicleType', 'modelYear', 'color'] }
            ]
        });

        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoice', error });
    }
};

// **Update Invoice (PATCH)**
exports.updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Invoice.update(req.body, { where: { id } });

        if (!updated) return res.status(404).json({ message: 'Invoice not found' });

        const updatedInvoice = await Invoice.findByPk(id);
        res.json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: 'Error updating invoice', error });
    }
};

// **Delete Invoice**
exports.deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Invoice.destroy({ where: { id } });

        if (!deleted) return res.status(404).json({ message: 'Invoice not found' });

        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting invoice', error });
    }
};
