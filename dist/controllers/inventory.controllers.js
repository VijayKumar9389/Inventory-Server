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
exports.InventoryControllers = void 0;
const inventory_services_1 = require("../services/inventory.services");
const item_record_services_1 = require("../services/item-record.services");
const inventoryServices = new inventory_services_1.InventoryServices();
const itemRecordServices = new item_record_services_1.ItemRecordServices();
class InventoryControllers {
    // Create a new inventory entry for a location and adds one item record
    createInventory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { locationId, itemId } = req.body;
                // Validate input data
                if (isNaN(locationId) || isNaN(itemId)) {
                    res.status(400).json({ message: 'Invalid input data' });
                    return;
                }
                // Create a single inventory entry
                const inventoryInput = {
                    locationId,
                    itemId,
                };
                // Create the inventory record
                const createdInventory = yield inventoryServices.createInventory(inventoryInput);
                // Create a single item record associated with the created inventory
                const itemRecordInput = {
                    itemId: createdInventory.itemId,
                    locationId: createdInventory.locationId,
                    inventoryId: createdInventory.id, // Use the id from the created inventory
                };
                const createdItemRecord = yield itemRecordServices.createItemRecord(itemRecordInput);
                res.status(201).json({ message: 'Inventory and Item Record created successfully', inventory: createdInventory, itemRecord: createdItemRecord });
            }
            catch (error) {
                console.error('Error creating or updating inventory:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    // Add a new method to get inventory by location ID
    getInventoryByLocationId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locationId = parseInt(req.params.locationId);
                // Validate input data
                if (isNaN(locationId)) {
                    res.status(400).json({ message: 'Invalid location ID' });
                    return;
                }
                const inventory = yield inventoryServices.getInventoryByLocation(locationId);
                res.status(200).json(inventory);
            }
            catch (error) {
                console.error('Error fetching inventory:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.InventoryControllers = InventoryControllers;
