import { Request, Response } from 'express';
import { LocationServices } from '../services/location.services'; // Adjusted path

import {CreateLocationDTO, LocationWithInventory} from "../models/inventory.models"; // Adjusted path

const locationServices = new LocationServices();

export class LocationController {

    // Get all locations
    public async getAllLocationsController(req: Request, res: Response): Promise<void> {
        try {
            const locations = await locationServices.getAllLocations();
            res.status(200).json(locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Create a new location
    public async createLocationController(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body as CreateLocationDTO;

            // Simplified the object creation
            const createdLocation = await locationServices.createLocation({ name, description });
            res.status(201).json({ message: 'Location created successfully', location: createdLocation });
        } catch (error) {
            console.error('Error creating location:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async updateLocation(req: Request, res: Response): Promise<void> {
        try {
            const locationId: number = parseInt(req.params.id);
            const { name, description } = req.body as CreateLocationDTO;

            const updatedLocation = await locationServices.updateLocation(locationId, { name, description });
            res.status(200).json({ message: 'Location updated successfully', location: updatedLocation });
        } catch (error) {
            console.error('Error updating location:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async deleteLocation(req: Request, res: Response): Promise<void> {
        try {
            const locationId: number = parseInt(req.params.id);
            const currentLocation: LocationWithInventory | null = await locationServices.getLocationsById(locationId);

            if (!currentLocation) {
                res.status(404).json({ message: 'Location not found' });
                return;
            }

            // check if location has inventory
            if (currentLocation.inventory.length > 0) {
                res.status(400).json({ message: 'Location has inventory. Cannot delete' });
                return;
            }

            const deletedLocation = await locationServices.deleteLocation(locationId);
            res.status(200).json({ message: 'Location deleted successfully', location: currentLocation });
        } catch (error) {
            console.error('Error deleting location:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Get a location by idß
    public async getLocationByIdController(req: Request, res: Response): Promise<void> {
        try {
            const locationId: number = Number(req.params.id);
            const location: LocationWithInventory | null = await locationServices.getLocationsById(locationId);
            res.status(200).json(location);
        } catch (error) {
            console.error('Error fetching location by id:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
