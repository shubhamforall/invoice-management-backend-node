const Vehicle = require('../models/vehicleModel');
const { applyFilters } = require("../utils/filterUtils");
// Create Vehicle
const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating vehicle', error });
  }
};

// Get All Vehicles
const getAllVehicles = async (req, res) => {
  try {
    const filters = applyFilters(req.query, ["name", "number", "type", "modelYear"]);
    const vehicles = await Vehicle.findAll({ where: filters });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error });
  }
};

// Get Vehicle By ID
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle', error });
  }
};

// Update Vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Vehicle.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ message: 'Vehicle not found' });

    const updatedVehicle = await Vehicle.findByPk(id);
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error updating vehicle', error });
  }
};

// Delete Vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vehicle.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
