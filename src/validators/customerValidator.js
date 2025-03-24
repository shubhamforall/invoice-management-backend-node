// validators/customer.validator.js
const { body } = require('express-validator');

exports.customerValidator = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('mobileNo').matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
  body('email').notEmpty().isEmail().withMessage('Valid email is required'),
  body('address').notEmpty().withMessage('Address is required'),
];
