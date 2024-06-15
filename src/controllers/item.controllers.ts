import {Request, Response} from 'express';
import {ItemServices} from "../services/item.services";
import {ItemWithInventory, UpdateItemDTO, UploadItemDTO} from "../models/inventory.models";
import {Item} from "@prisma/client";
import {bucketName, s3} from "../api/middleware/s3";
import {DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import {v4 as uuidv4} from "uuid";

const itemService: ItemServices = new ItemServices();

export class ItemControllers {

    // Create a new item
    async createItem(req: Request, res: Response): Promise<void> {
        try {
            const { name, description, value } = req.body as UploadItemDTO;

            // Parse value to a float
            const floatValue: number = parseFloat(String(value));

            // Check if a file was uploaded
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }

            // Determine the environment
            const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

            // Generate a unique filename for the S3 object
            const randomName: string = uuidv4();

            // Create a key with the environment folder
            const key: string = `${environment}/${randomName}`;

            // Set up parameters for uploading to S3
            const params = {
                Bucket: bucketName,
                Key: key, // Use the original file name as the S3 object key
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            };

            // Upload the file to S3
            const command = new PutObjectCommand(params);
            await s3.send(command);

            // You may want to store the S3 URL or key in your database for reference
            // Here, we're just returning the original file name as a placeholder
            const createdItem = await itemService.createItem({
                name,
                description,
                value: floatValue,
                image: randomName
            });

            res.status(201).json({ message: 'Item created successfully', item: createdItem });
        } catch (error) {
            console.error('Error creating item:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Controller method to handle the HTTP request
    public async updateItem(req: Request, res: Response): Promise<void> {
        try {
            const itemId: number = parseInt(req.params.id);
            const { name, description, value } = req.body as UpdateItemDTO;
            const imageFile: Express.Multer.File | undefined = req.file;

            // Fetch the current item from the database
            let currentItem: UpdateItemDTO | null = await itemService.getItemById(itemId);

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
                const randomName: string = uuidv4();

                // Create a key with the environment folder
                const newKey: string = `${environment}/${randomName}`;


                const params = {
                    Bucket: bucketName,
                    Key: newKey,
                    Body: imageFile.buffer,
                    ContentType: imageFile.mimetype,
                };
                const command: PutObjectCommand = new PutObjectCommand(params);
                await s3.send(command);

                // Delete key
                const deletkey: string = `${environment}/${currentItem.image}`;

                // Remove the previous image file from S3 if it exists
                if (currentItem.image) {
                    const deleteParams = {
                        Bucket: bucketName,
                        Key: deletkey,
                    };
                    const deleteCommand: DeleteObjectCommand = new DeleteObjectCommand(deleteParams);
                    await s3.send(deleteCommand);
                }

                // Update the image property in the database with the new S3 key
                currentItem.image = randomName;
            }

            // Update other properties of the item
            currentItem.name = name;
            currentItem.description = description !== null ? description : ''; // Handle null description
            currentItem.value = value;

            // Save the updated item to the database
            const updatedItem: Item = await itemService.updateItem(itemId, currentItem);

            res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
        } catch (error) {
            console.error('Error updating item:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // Controller method to handle the HTTP request
    public async deleteItem(req: Request, res: Response): Promise<void> {
        try {
            const itemId: number = parseInt(req.params.id);

            // Fetch the current item from the database
            const currentItem: ItemWithInventory | null = await itemService.getItemById(itemId);

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
            const deletedItem: Item | null = await itemService.deleteItem(itemId);

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
                    Bucket: bucketName,
                    Key: deletedItem.image,
                };
                const deleteCommand = new DeleteObjectCommand(deleteParams);
                await s3.send(deleteCommand);
            }

            res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    // Get all items
    public async getAllItems(req: Request, res: Response): Promise<void> {
        try {
            const items: ItemWithInventory[] = await itemService.getAllItems();
            res.status(200).json(items);
        } catch (error) {
            console.error('Error fetching items:', error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }

    // Get an item by ID
    public async getItemById(req: Request, res: Response): Promise<void> {
        try {
            const itemId: number = parseInt(req.params.id);
            const item: ItemWithInventory = await itemService.getItemById(itemId);
            res.status(200).json(item);
        } catch (error) {
            console.error('Error fetching item:', error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }
}
