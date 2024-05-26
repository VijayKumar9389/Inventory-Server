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
exports.ItemRecordControllers = void 0;
const item_record_services_1 = require("../services/item-record.services");
const inventory_services_1 = require("../services/inventory.services");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_1 = require("../middleware/s3");
const uuid_1 = require("uuid");
const itemRecordService = new item_record_services_1.ItemRecordServices();
const inventoryService = new inventory_services_1.InventoryServices();
class ItemRecordControllers {
    // Controller method to handle the HTTP request
    editItemRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const { notes, receipt, missing } = req.body;
                const imageFile = req.file;
                // Fetch the current item record from the database
                const currentItemRecord = yield itemRecordService.getItemRecordById(id);
                // Check if the item record exists
                if (!currentItemRecord) {
                    res.status(404).json({ message: 'Item record not found' });
                    return;
                }
                let updatedReceipt = currentItemRecord.receipt;
                // Update the receipt property if a new file is uploaded
                if (imageFile) {
                    // Generate a unique name for the new file
                    const uniqueFileName = (0, uuid_1.v4)();
                    // Delete the current receipt file from S3 if it exists
                    if (currentItemRecord.receipt) {
                        const deleteParams = {
                            Bucket: s3_1.bucketName,
                            Key: currentItemRecord.receipt,
                        };
                        try {
                            yield s3_1.s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
                        }
                        catch (error) {
                            console.error('Error deleting old file from S3:', error);
                            res.status(500).json({ message: 'Error deleting old file from S3' });
                            return;
                        }
                    }
                    // Set up parameters for uploading to S3
                    const uploadParams = {
                        Bucket: s3_1.bucketName,
                        Key: uniqueFileName,
                        Body: imageFile.buffer,
                        ContentType: imageFile.mimetype,
                    };
                    try {
                        // Upload the new file to S3
                        yield s3_1.s3.send(new client_s3_1.PutObjectCommand(uploadParams));
                        updatedReceipt = uniqueFileName;
                    }
                    catch (error) {
                        console.error('Error uploading file to S3:', error);
                        res.status(500).json({ message: 'Error uploading file to S3' });
                        return;
                    }
                }
                // Update other properties of the item record
                const updatedNotes = typeof notes === 'string' ? notes : '';
                // Construct a new object with the updated properties
                const updatedItemRecord = {
                    notes: updatedNotes,
                    receipt: updatedReceipt,
                    missing: missing === 'true',
                };
                // Save the updated item record to the database
                const result = yield itemRecordService.updateItemRecord(id, updatedItemRecord);
                res.status(200).json({ message: 'Item record updated successfully', itemRecord: result });
            }
            catch (error) {
                console.error('Error updating item record:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // delete item record
    createItemRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { itemId, locationId, inventoryId } = req.body;
                const createdItemRecord = yield itemRecordService.createItemRecord({
                    itemId,
                    locationId,
                    inventoryId,
                });
                res.status(201).json({ message: 'Item record created successfully', itemRecord: createdItemRecord });
            }
            catch (error) {
                console.error('Error creating item record:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Controller method to handle the HTTP request
    deleteItemRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const deletedItemRecord = yield itemRecordService.deleteItemRecord(id);
                // Check if the deleted item record is the last one
                const hasMoreRecords = yield itemRecordService.hasMoreRecords(deletedItemRecord.inventoryId);
                // If there are no more records, delete the inventory
                if (!hasMoreRecords) {
                    yield inventoryService.deleteInventory(deletedItemRecord.inventoryId);
                }
                res.status(200).json({ message: 'Item record deleted successfully', itemRecord: deletedItemRecord });
            }
            catch (error) {
                console.error('Error deleting item record:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.ItemRecordControllers = ItemRecordControllers;
