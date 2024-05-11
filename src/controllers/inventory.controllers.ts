import {Request, Response} from 'express';
import {InventoryServices} from '../services/inventory.services';
import {CreateInventoryDTO, CreateItemRecordDTO, CreateLocationDTO} from "../models/inventory.models";
import {ItemRecordServices} from "../services/item-record.services";

const inventoryServices: InventoryServices = new InventoryServices();
const itemRecordServices: ItemRecordServices = new ItemRecordServices();

export class InventoryControllers {

    // Create a new inventory entry for a location and adds one item record
    public async createInventory(req: Request, res: Response): Promise<void> {
        try {
            const { locationId, itemId } = req.body;

            // Validate input data
            if (isNaN(locationId) || isNaN(itemId)) {
                res.status(400).json({ message: 'Invalid input data' });
                return;
            }

            // Create a single inventory entry
            const inventoryInput: CreateInventoryDTO = {
                locationId,
                itemId,
            };

            // Create the inventory record
            const createdInventory = await inventoryServices.createInventory(inventoryInput);

            // Create a single item record associated with the created inventory
            const itemRecordInput: CreateItemRecordDTO = {
                itemId: createdInventory.itemId,
                locationId: createdInventory.locationId,
                inventoryId: createdInventory.id, // Use the id from the created inventory
            };

            const createdItemRecord = await itemRecordServices.createItemRecord(itemRecordInput);

            res.status(201).json({ message: 'Inventory and Item Record created successfully', inventory: createdInventory, itemRecord: createdItemRecord });
        } catch (error) {
            console.error('Error creating or updating inventory:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }


    // Add a new method to get inventory by location ID
    public async getInventoryByLocationId(req: Request, res: Response): Promise<void> {
        try {
            const locationId: number = parseInt(req.params.locationId);

            // Validate input data
            if (isNaN(locationId)) {
                res.status(400).json({message: 'Invalid location ID'});
                return;
            }

            const inventory = await inventoryServices.getInventoryByLocation(locationId);
            res.status(200).json(inventory);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    }
}
