const express = require('express');
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require('../controllers/invoiceController');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { invoiceValidator } = require('../validators/invoiceValidator');

const router = express.Router();

router.post('/', authenticate, invoiceValidator, validate, createInvoice);
router.get('/', authenticate, getAllInvoices);
router.get('/:id', authenticate, getInvoiceById);
router.patch('/:id', authenticate, invoiceValidator, validate, updateInvoice);
router.delete('/:id', authenticate, deleteInvoice);

module.exports = router;
