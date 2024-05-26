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
exports.InventoryServices = void 0;
const client_1 = require("@prisma/client");
// import {NewLocationInput} from "../models/inventory.models";
const prisma = new client_1.PrismaClient();
class InventoryServices {
    // Create a new inventory
    createInventory(inventoryInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.inventory.create({
                    data: {
                        locationId: inventoryInput.locationId,
                        itemId: inventoryInput.itemId,
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get inventory by location
    getInventoryByLocation(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield prisma.location.findUnique({
                    where: {
                        id: locationId,
                    },
                    include: {
                        inventory: {
                            include: {
                                item: true,
                                records: true // Include all associated item records for each inventory
                            }
                        },
                    },
                });
                return location;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteInventory(inventoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma.inventory.delete({
                    where: {
                        id: inventoryId,
                    },
                });
            }
            catch (error) {
                console.error('Error deleting inventory:', error);
                throw error;
            }
        });
    }
}
exports.InventoryServices = InventoryServices;
