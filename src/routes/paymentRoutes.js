const express = require('express');
const router = express.Router();
const { getCustomerPayments } = require('../controllers/paymentController');

router.get('/', getCustomerPayments);

module.exports = router;
