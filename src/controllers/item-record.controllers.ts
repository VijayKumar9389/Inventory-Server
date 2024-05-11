import { Request, Response } from 'express';
import { ItemRecordServices } from '../services/item-record.services';
import { UpdateItemRecordDTO } from '../models/item-record.models';
import {InventoryServices} from "../services/inventory.services";
import {ItemRecord} from "@prisma/client";
import path from "path";
import fs from "fs";

const itemRecordService: ItemRecordServices = new ItemRecordServices();
const inventoryService: InventoryServices = new InventoryServices();

export class ItemRecordControllers {

    // Controller method to handle the HTTP request
    public async editItemRecord(req: Request, res: Response): Promise<void> {
        try {
            const id: number = parseInt(req.params.id);
            const { notes, receipt, missing } = req.body;
            const imageFile: Express.Multer.File | undefined = req.file;

            // Fetch the current item record from the database
            const currentItemRecord: {
                id: number;
                receipt: string | null;
                missing: boolean;
                notes: string | null;
                itemId: number;
                locationId: number;
                inventoryId: number | null;
            } | null = await itemRecordService.getItemRecordById(id);

            // Check if the item record exists
            if (!currentItemRecord) {
                res.status(404).json({ message: 'Item record not found' });
                return;
            }

            let updatedReceipt: string | null = currentItemRecord.receipt;

            // Update the receipt property if a new file is uploaded
            if (imageFile) {
                // Remove the current receipt file if it exists
                if (currentItemRecord.receipt) {
                    const currentReceiptPath: string = path.join('uploads', currentItemRecord.receipt);
                    fs.unlinkSync(currentReceiptPath);
                }

                // Update the receipt property in the database with the new file path
                updatedReceipt = path.basename(imageFile.path);
            }

            // Update other properties of the item record
            const updatedNotes: string = typeof notes === 'string' ? notes : '';

            // Construct a new object with the updated properties
            const updatedItemRecord: UpdateItemRecordDTO = {
                notes: updatedNotes ,
                receipt: updatedReceipt,
                missing: missing === 'true',
            };

            // Save the updated item record to the database
            const result = await itemRecordService.updateItemRecord(id, updatedItemRecord);

            res.status(200).json({ message: 'Item record updated successfully', itemRecord: result });
        } catch (error) {
            console.error('Error updating item record:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    // delete item record
    public async createItemRecord(req: Request, res: Response): Promise<void> {
        try {
            const { itemId, locationId, inventoryId } = req.body;

            const createdItemRecord = await itemRecordService.createItemRecord({
                itemId,
                locationId,
                inventoryId,
            });

            res.status(201).json({ message: 'Item record created successfully', itemRecord: createdItemRecord });
        } catch (error) {
            console.error('Error creating item record:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    // Controller method to handle the HTTP request
    public async deleteItemRecord(req: Request, res: Response): Promise<void> {
        try {
            const id: number = parseInt(req.params.id);
            const deletedItemRecord = await itemRecordService.deleteItemRecord(id);

            // Check if the deleted item record is the last one
            const hasMoreRecords: boolean = await itemRecordService.hasMoreRecords(deletedItemRecord.inventoryId);

            // If there are no more records, delete the inventory
            if (!hasMoreRecords) {
                await inventoryService.deleteInventory(deletedItemRecord.inventoryId);
            }

            res.status(200).json({ message: 'Item record deleted successfully', itemRecord: deletedItemRecord });
        } catch (error) {
            console.error('Error deleting item record:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
