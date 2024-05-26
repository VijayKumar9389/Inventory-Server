"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const location_services_1 = require("../services/location.services"); // Adjusted path
const locationServices = new location_services_1.LocationServices();
class LocationController {
    // Get all locations
    getAllLocationsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locations = yield locationServices.getAllLocations();
                res.status(200).json(locations);
            }
            catch (error) {
                console.error('Error fetching locations:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    // Create a new location
    createLocationController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description } = req.body;
                // Simplified the object creation
                const createdLocation = yield locationServices.createLocation({ name, description });
                res.status(201).json({ message: 'Location created successfully', location: createdLocation });
            }
            catch (error) {
                console.error('Error creating location:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    updateLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locationId = parseInt(req.params.id);
                const { name, description } = req.body;
                const updatedLocation = yield locationServices.updateLocation(locationId, { name, description });
                res.status(200).json({ message: 'Location updated successfully', location: updatedLocation });
            }
            catch (error) {
                console.error('Error updating location:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    deleteLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locationId = parseInt(req.params.id);
                const currentLocation = yield locationServices.getLocationsById(locationId);
                if (!currentLocation) {
                    res.status(404).json({ message: 'Location not found' });
                    return;
                }
                // check if location has inventory
                if (currentLocation.inventory.length > 0) {
                    res.status(400).json({ message: 'Location has inventory. Cannot delete' });
                    return;
                }
                const deletedLocation = yield locationServices.deleteLocation(locationId);
                res.status(200).json({ message: 'Location deleted successfully', location: currentLocation });
            }
            catch (error) {
                console.error('Error deleting location:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Get a location by idß
    getLocationByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locationId = Number(req.params.id);
                const location = yield locationServices.getLocationsById(locationId);
                res.status(200).json(location);
            }
            catch (error) {
                console.error('Error fetching location by id:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.LocationController = LocationController;
