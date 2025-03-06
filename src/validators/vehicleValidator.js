const { body } = require('express-validator');

const vehicleValidator = [
  body('name').notEmpty().withMessage('Vehicle name is required'),
  body('number').notEmpty().withMessage('Vehicle number is required'),
  body('type').notEmpty().withMessage('Vehicle type is required'),
  body('modelYear')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`Model year must be between 1900 and ${new Date().getFullYear()}`),
  body('colour').notEmpty().withMessage('Vehicle colour is required'),
];

module.exports = { vehicleValidator };
