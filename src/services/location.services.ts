import {Location, PrismaClient} from "@prisma/client";

import {CreateLocationDTO, LocationWithInventory} from "../models/inventory.models";

const prisma = new PrismaClient();

export class LocationServices {

    // Get all locations with associated inventory and items
    public async getAllLocations(): Promise<Location[]> {
        try {
            return await prisma.location.findMany({
                include: {
                    inventory: {
                        include: {
                            item: true, // Include the associated item
                            records: true
                        }
                    }
                }
            });
        } catch (error) {
            // Handle error
            console.error("Error fetching locations with inventory and items:", error);
            throw error;
        }
    }

    // create a new location
    public async createLocation(locationInput: CreateLocationDTO): Promise<Location> {
        try {
            return await prisma.location.create({
                data: {
                    name: locationInput.name,
                    description: locationInput.description
                }
            });
        } catch (error) {
            // Handle error
            console.error("Error creating location:", error);
            throw error;
        }
    }

    public async updateLocation(locationId: number, locationData: CreateLocationDTO): Promise<Location> {
        try {
            return await prisma.location.update({
                where: {
                    id: locationId
                },
                data: {
                    name: locationData.name,
                    description: locationData.description
                }
            });
        } catch (error) {
            console.error("Error updating location:", error);
            throw error;
        }
    }

    public async deleteLocation(locationId: number): Promise<Location> {
        try {
            return await prisma.location.delete({
                where: {
                    id: locationId
                }
            });
        } catch (error) {
            console.error("Error deleting location:", error);
            throw error;
        }
    }

    // Get a location by id
    public async getLocationsById(locationId: number): Promise<LocationWithInventory | null> {
        try {
            return await prisma.location.findUnique({
                where: {
                    id: locationId
                },
                include: {
                    inventory: {
                        include: {
                            item: true, // Include the associated item
                            records: true // Include the associated records
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Error fetching location by id:", error);
            throw error;
        }
    }
}

