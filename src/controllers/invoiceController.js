const Invoice = require("../models/invoiceModel");
const Customer = require("../models/customerModel");
const Vehicle = require("../models/vehicleModel");
const generateInvoice = require("../services/generateInvoice");
const sendInvoiceEmail = require("../services/emailService");
const { applyFilters, applyDateRangeFilter } = require("../utils/filterUtils");

exports.createInvoice = async (req, res) => {
  try {
    const {
      customerId,
      vehicleId,
      driverName,
      date,
      loadingAddress,
      deliveryAddress,
      weight,
      rate,
    } = req.body;

    // Validate Customer
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res
        .status(400)
        .json({ message: "Invalid customer. Customer does not exist." });
    }

    // Validate Vehicle
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res
        .status(400)
        .json({ message: "Invalid vehicle. Vehicle does not exist." });
    }

    // **Ensure `weight` and `rate` are valid before calculating total**
    if (!weight || !rate) {
      return res.status(400).json({
        message: "Weight and rate must be provided and greater than zero.",
      });
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
      status: "Unpaid",
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
      total: invoice.total,
    };

    // **Generate Invoice PDF**
    const pdfPath = await generateInvoice(invoiceData);

    // **Send Invoice via Email**
    await sendInvoiceEmail(customer.email, pdfPath);

    res
      .status(201)
      .json({ message: "Invoice created and sent via email", invoice });
  } catch (error) {
    console.error("Invoice creation error:", error); // Debugging log
    res.status(500).json({ message: "Error creating invoice", error });
  }
};

// controllers/invoiceController.js
exports.downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id, {
      include: [{ model: Customer }, { model: Vehicle }],
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const invoiceData = {
      invoiceNumber: invoice.id,
      date: invoice.date,
      status: invoice.status,
      customerName: `${invoice.Customer.firstName} ${invoice.Customer.lastName}`,
      customerEmail: invoice.Customer.email,
      customerAddress: invoice.Customer.address,
      customerMobile: invoice.Customer.mobileNo,
      vehicle: invoice.Vehicle.name,
      driverName: invoice.driverName,
      loadingAddress: invoice.loadingAddress,
      deliveryAddress: invoice.deliveryAddress,
      weight: invoice.weight,
      rate: invoice.rate,
      total: invoice.total,
    };

    const pdfPath = await generateInvoice(invoiceData);

    // ✅ Explicitly set content-type (optional but good)
    res.setHeader("Content-Type", "application/pdf");

    res.download(pdfPath, `invoice_${invoice.id}.pdf`, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).send("Error downloading the invoice");
      }
    });
  } catch (error) {
    console.error("Error in downloadInvoice:", error);
    res.status(500).json({ message: "Server error", error });
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
        {
          model: Customer,
          attributes: ["firstName", "lastName", "email", "mobileNo", "address"],
        },
        {
          model: Vehicle,
          attributes: ["name", "number", "type", "modelYear", "colour"],
        },
      ],
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};

// **Get Invoice By ID**
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          attributes: ["firstName", "lastName", "email", "mobileNo", "address"],
        },
        {
          model: Vehicle,
          attributes: ["name", "number", "type", "modelYear", "colour"],
        },
      ],
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoice", error });
  }
};

// **Update Invoice (PATCH)**
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Invoice.update(req.body, {
      where: { id },
    });

    if (!updated)
      return res.status(404).json({ message: "Invoice not found" });

    const updatedInvoice = await Invoice.findByPk(id, {
      include: [Customer, Vehicle], 
    });

    res.json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Error updating invoice", error });
  }
};

// **Delete Invoice**
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Invoice.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "Invoice not found" });

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting invoice", error });
  }
};
