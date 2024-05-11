import {Request, Response} from 'express';
import {ItemServices} from "../services/item.services";
import {ItemWithInventory, UpdateItemDTO, UploadItemDTO} from "../models/inventory.models";
import {Item} from "@prisma/client";
import path from "path";
import fs from "fs";

const itemService: ItemServices = new ItemServices();

export class ItemControllers {

    // Create a new item
    public async createItem(req: Request, res: Response): Promise<void> {
        try {
            const {name, description, value} = req.body as UploadItemDTO;

            // Parse value to a float
            const floatValue: number = parseFloat(String(value));

            const createdItem = await itemService.createItem({
                name,
                description,
                value: floatValue,
                image: req.file || null, // Directly pass req.file or null
            });

            res.status(201).json({message: 'Item created successfully', item: createdItem});
        } catch (error) {
            console.error('Error creating item:', error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

    public async deleteItem(req: Request, res: Response): Promise<void> {
        try {
            const itemId: number = parseInt(req.params.id);

            const currentItem: ItemWithInventory = await itemService.getItemById(itemId);

            if (!currentItem) {
                res.status(404).json({message: 'Item not found'});
                return;
            }

            if (currentItem.inventory.length > 0) {
                res.status(400).json({message: 'Item has inventory. Cannot delete'});
                return;
            }

            const deletedItem: Item | null = await itemService.deleteItem(itemId);

            if (!deletedItem) {
                res.status(404).json({message: 'Item not found'});
                return;
            }

            res.status(200).json({message: 'Item deleted successfully', item: deletedItem});
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

    // Controller method to handle the HTTP request
    public async updateItem(req: Request, res: Response): Promise<void> {
        try {
            const itemId: number = parseInt(req.params.id);
            const {name, description, value} = req.body as UpdateItemDTO;
            const imageFile: Express.Multer.File | undefined = req.file;

            // Fetch the current item from the database
            const currentItem: UpdateItemDTO | null = await itemService.getItemById(itemId);

            // Check if the item exists
            if (!currentItem) {
                res.status(404).json({message: 'Item not found'});
                return;
            }

            // Update the image property if a new file is uploaded
            if (imageFile) {
                // Remove the current image file if it exists
                if (currentItem.image) {
                    const currentImagePath: string = path.join('uploads', currentItem.image);
                    fs.unlinkSync(currentImagePath);
                }

                // Update the image property in the database with the new file path
                currentItem.image = path.basename(imageFile.path);
            }

            // Update other properties of the item
            currentItem.name = name;
            currentItem.description = description !== null ? description : ''; // Handle null description
            currentItem.value = value;

            // Save the updated item to the database
            const updatedItem: Item = await itemService.updateItem(itemId, currentItem);

            res.status(200).json({message: 'Item updated successfully', item: updatedItem});
        } catch (error) {
            console.error('Error updating item:', error);
            res.status(500).json({message: 'Internal server error'});
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
