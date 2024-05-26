"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_controllers_1 = require("../controllers/item.controllers");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = (0, express_1.Router)();
const itemController = new item_controllers_1.ItemControllers();
// Create a new item
router.post('/create', multer_1.default.single('image'), itemController.createItem);
// Get all items
router.get('/getAll', itemController.getAllItems);
// Get an item by ID
router.get('/get/:id', itemController.getItemById);
// Update an item
router.put('/update/:id', multer_1.default.single('image'), itemController.updateItem);
// Delete an item
router.delete('/delete/:id', itemController.deleteItem);
exports.default = router;
