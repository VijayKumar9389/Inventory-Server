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
exports.ItemControllers = void 0;
const item_services_1 = require("../services/item.services");
const s3_1 = require("../api/middleware/s3");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const itemService = new item_services_1.ItemServices();
class ItemControllers {
    // Create a new item
    createItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, value } = req.body;
                // Parse value to a float
                const floatValue = parseFloat(String(value));
                // Check if a file was uploaded
                if (!req.file) {
                    res.status(400).json({ message: 'No file uploaded' });
                    return;
                }
                // Determine the environment
                const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
                // Generate a unique filename for the S3 object
                const randomName = (0, uuid_1.v4)();
                // Create a key with the environment folder
                const key = `${environment}/${randomName}`;
                // Set up parameters for uploading to S3
                const params = {
                    Bucket: s3_1.bucketName,
                    Key: key, // Use the original file name as the S3 object key
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype,
                };
                // Upload the file to S3
                const command = new client_s3_1.PutObjectCommand(params);
                yield s3_1.s3.send(command);
                // You may want to store the S3 URL or key in your database for reference
                // Here, we're just returning the original file name as a placeholder
                const createdItem = yield itemService.createItem({
                    name,
                    description,
                    value: floatValue,
                    image: randomName
                });
                res.status(201).json({ message: 'Item created successfully', item: createdItem });
            }
            catch (error) {
                console.error('Error creating item:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Controller method to handle the HTTP request
    updateItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = parseInt(req.params.id);
                const { name, description, value } = req.body;
                const imageFile = req.file;
                // Fetch the current item from the database
                let currentItem = yield itemService.getItemById(itemId);
                // Check if the item exists
                if (!currentItem) {
                    res.status(404).json({ message: 'Item not found' });
                    return;
                }
                // Determine the environment
                const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
                // Update the image property if a new file is uploaded
                if (imageFile) {
                    // Upload the new image to S3
                    const randomName = (0, uuid_1.v4)();
                    // Create a key with the environment folder
                    const newKey = `${environment}/${randomName}`;
                    const params = {
                        Bucket: s3_1.bucketName,
                        Key: newKey,
                        Body: imageFile.buffer,
                        ContentType: imageFile.mimetype,
                    };
                    const command = new client_s3_1.PutObjectCommand(params);
                    yield s3_1.s3.send(command);
                    // Delete key
                    const deletkey = `${environment}/${currentItem.image}`;
                    // Remove the previous image file from S3 if it exists
                    if (currentItem.image) {
                        const deleteParams = {
                            Bucket: s3_1.bucketName,
                            Key: deletkey,
                        };
                        const deleteCommand = new client_s3_1.DeleteObjectCommand(deleteParams);
                        yield s3_1.s3.send(deleteCommand);
                    }
                    // Update the image property in the database with the new S3 key
                    currentItem.image = randomName;
                }
                // Update other properties of the item
                currentItem.name = name;
                currentItem.description = description !== null ? description : ''; // Handle null description
                currentItem.value = value;
                // Save the updated item to the database
                const updatedItem = yield itemService.updateItem(itemId, currentItem);
                res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
            }
            catch (error) {
                console.error('Error updating item:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Controller method to handle the HTTP request
    deleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = parseInt(req.params.id);
                // Fetch the current item from the database
                const currentItem = yield itemService.getItemById(itemId);
                if (!currentItem) {
                    res.status(404).json({ message: 'Item not found' });
                    return;
                }
                // Check if the item has associated inventory. If it does, it cannot be deleted.
                if (currentItem.inventory.length > 0) {
                    res.status(400).json({ message: 'Item has inventory. Cannot delete' });
                    return;
                }
                // Delete the item from the database
                const deletedItem = yield itemService.deleteItem(itemId);
                if (!deletedItem) {
                    res.status(404).json({ message: 'Item not found' });
                    return;
                }
                // Determine the environment
                const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
                // Create the S3 key with the environment folder
                const deleteKey = `${environment}/${deletedItem.image}`;
                // If the item had an associated image, delete it from S3
                if (deletedItem.image) {
                    const deleteParams = {
                        Bucket: s3_1.bucketName,
                        Key: deletedItem.image,
                    };
                    const deleteCommand = new client_s3_1.DeleteObjectCommand(deleteParams);
                    yield s3_1.s3.send(deleteCommand);
                }
                res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
            }
            catch (error) {
                console.error('Error deleting item:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Get all items
    getAllItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield itemService.getAllItems();
                res.status(200).json(items);
            }
            catch (error) {
                console.error('Error fetching items:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    // Get an item by ID
    getItemById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const itemId = parseInt(req.params.id);
                const item = yield itemService.getItemById(itemId);
                res.status(200).json(item);
            }
            catch (error) {
                console.error('Error fetching item:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.ItemControllers = ItemControllers;
