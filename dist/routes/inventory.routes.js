"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventory_controllers_1 = require("../controllers/inventory.controllers");
const router = (0, express_1.Router)();
const inventoryController = new inventory_controllers_1.InventoryControllers();
// Create a new inventory entry
router.post('/create', inventoryController.createInventory);
// Get inventory for a location
router.get('/getByLocation/:locationId', inventoryController.getInventoryByLocationId);
exports.default = router;
