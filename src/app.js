require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); 

// Initialize App
const app = express();

// Middleware
const allowedOrigin = process.env.CORS_ALLOWED_ORIGINS 

app.use(cors({
  origin: allowedOrigin,  // Use the single allowed origin
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
  exposedHeaders: ["Content-Disposition"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('path/to/assets'));

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Invoice Management API Running!");
});

app.use('/auth', authRoutes);
app.use('/customer', customerRoutes)
app.use('/vehicle', vehicleRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/payments', paymentRoutes);

// Connect to DB
connectDB();

module.exports = app;
