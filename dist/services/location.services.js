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
exports.LocationServices = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LocationServices {
    // Get all locations with associated inventory and items
    getAllLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.location.findMany({
                    include: {
                        inventory: {
                            include: {
                                item: true, // Include the associated item
                                records: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                // Handle error
                console.error("Error fetching locations with inventory and items:", error);
                throw error;
            }
        });
    }
    // create a new location
    createLocation(locationInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.location.create({
                    data: {
                        name: locationInput.name,
                        description: locationInput.description
                    }
                });
            }
            catch (error) {
                // Handle error
                console.error("Error creating location:", error);
                throw error;
            }
        });
    }
    updateLocation(locationId, locationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.location.update({
                    where: {
                        id: locationId
                    },
                    data: {
                        name: locationData.name,
                        description: locationData.description
                    }
                });
            }
            catch (error) {
                console.error("Error updating location:", error);
                throw error;
            }
        });
    }
    deleteLocation(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.location.delete({
                    where: {
                        id: locationId
                    }
                });
            }
            catch (error) {
                console.error("Error deleting location:", error);
                throw error;
            }
        });
    }
    // Get a location by id
    getLocationsById(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.location.findUnique({
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
            }
            catch (error) {
                console.error("Error fetching location by id:", error);
                throw error;
            }
        });
    }
}
exports.LocationServices = LocationServices;
