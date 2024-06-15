"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_record_controllers_1 = require("../../controllers/item-record.controllers");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = (0, express_1.Router)();
const itemRecordController = new item_record_controllers_1.ItemRecordControllers();
// Create a new item record
router.put('/update/:id', multer_1.default.single('receipt'), itemRecordController.editItemRecord);
// Get all item records
router.post('/create', itemRecordController.createItemRecord);
// Get an item record by ID
router.delete('/delete/:id', itemRecordController.deleteItemRecord);
exports.default = router;
