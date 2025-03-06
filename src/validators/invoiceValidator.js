const { body } = require('express-validator');

exports.invoiceValidator = [
  body('customerId').isUUID().withMessage('Invalid customer ID format'),
  body('vehicleId').isUUID().withMessage('Invalid vehicle ID format'),
  body('driverName').notEmpty().withMessage('Driver name is required'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('loadingAddress').notEmpty().withMessage('Loading address is required'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required'),
  body('weight').isFloat({ gt: 0 }).withMessage('Weight must be greater than 0'),
  body('rate').isFloat({ gt: 0 }).withMessage('Rate must be greater than 0')
];
