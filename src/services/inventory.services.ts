import {PrismaClient} from "@prisma/client";
import {CreateInventoryDTO, CreateItemRecordDTO} from "../models/inventory.models";
// import {NewLocationInput} from "../models/inventory.models";

const prisma = new PrismaClient();

export class InventoryServices {

    // Create a new inventory
    public async createInventory(inventoryInput: CreateInventoryDTO): Promise<any> {
        try {
            return await prisma.inventory.create({
                data: {
                    locationId: inventoryInput.locationId,
                    itemId: inventoryInput.itemId,
                },
            });
        } catch (error) {
            throw error;
        }
    }



    // Get inventory by location
    public async getInventoryByLocation(locationId: number): Promise<any> {
        try {
            const location = await prisma.location.findUnique({
                where: {
                    id: locationId,
                },
                include: {
                    inventory: {
                        include: {
                            item: true,
                            records: true // Include all associated item records for each inventory
                        }
                    },
                },
            });
            return location;
        } catch (error) {
            throw error;
        }
    }

    public async deleteInventory(inventoryId: number): Promise<void> {
        try {
            await prisma.inventory.delete({
                where: {
                    id: inventoryId,
                },
            });
        } catch (error) {
            console.error('Error deleting inventory:', error);
            throw error;
        }
    }

    // // Update inventory quantity
    // public async updateInventoryQuantity(inventoryId: number, quantity: number): Promise<any> {
    //     try {
    //         const updatedInventory = await prisma.inventory.update({
    //             where: {
    //                 id: inventoryId,
    //             },
    //             data: {
    //                 quantity: quantity,
    //             },
    //         });
    //         return updatedInventory;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // // Delete inventory
    // public async deleteInventory(inventoryId: number): Promise<any> {
    //     try {
    //         const deletedInventory = await prisma.inventory.delete({
    //             where: {
    //                 id: inventoryId,
    //             },
    //         });
    //         return deletedInventory;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // // Get inventory by item and location
    // public async getInventoryByItemAndLocation(itemId: number, locationId: number): Promise<any> {
    //     try {
    //         const inventory = await prisma.inventory.findFirst({
    //             where: {
    //                 itemId: itemId,
    //                 locationId: locationId,
    //             },
    //             include: {
    //                 item: true,
    //                 location: true,
    //             },
    //         });
    //         return inventory;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}