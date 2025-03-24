const express = require('express');
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
const { customerValidator } = require('../validators/customerValidator');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post('/', authenticate, customerValidator, validate, createCustomer);
router.patch('/:id', authenticate, customerValidator, validate, updateCustomer); 
router.get('/', authenticate, getAllCustomers);
router.get('/:id', authenticate, getCustomerById);
router.delete('/:id', authenticate, deleteCustomer);

module.exports = router;