const express = require('express');
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { vehicleValidator } = require('../validators/vehicleValidator');
const authenticate = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post('/', authenticate, vehicleValidator, validate, createVehicle);
router.get('/', authenticate, getAllVehicles);
router.get('/:id', authenticate, getVehicleById);
router.patch('/:id', authenticate, vehicleValidator, validate, updateVehicle);
router.delete('/:id', authenticate, deleteVehicle);

module.exports = router;
