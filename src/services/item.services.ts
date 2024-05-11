import {PrismaClient} from '@prisma/client';
import {ItemWithInventory, UploadItemDTO, UpdateItemDTO} from "../models/inventory.models";
const prisma = new PrismaClient();
export class ItemServices {

    // Create a new item
    public async createItem(itemInput: UploadItemDTO): Promise<any> {
        try {
            let imageUrl: string | undefined = undefined;

            if (itemInput.image) {
                imageUrl = itemInput.image.filename;
            }

            return await prisma.item.create({
                data: {
                    name: itemInput.name,
                    description: itemInput.description,
                    image: imageUrl,
                    value: itemInput.value,
                },
            });

        } catch (error) {
            throw error;
        }
    }

    // Get all items
    public async getAllItems(): Promise<any> {
        try {
            return await prisma.item.findMany({
                include: {
                    inventory: {
                        include: {
                            location: true,
                            records: true
                        }
                    }
                }
            });
        } catch (error) {
            throw error;
        }
    }

    public async updateItem(itemId: number, itemData: UpdateItemDTO): Promise<any> {
        try {
            return await prisma.item.update({
                where: {
                    id: itemId
                },
                data: {
                    name: itemData.name,
                    description: itemData.description !== null ? itemData.description : '', // Handle null description
                    image: itemData.image ? itemData.image : '',
                    value: Number(itemData.value) // Convert value to number
                }
            });
        } catch (error) {
            throw error;
        }
    }

    public async deleteItem(itemId: number): Promise<any> {
        try {
            return await prisma.item.delete({
                where: {
                    id: itemId
                }
            });
        } catch (error) {
            throw error;
        }
    }

    public async getItemById(itemId: number): Promise<any> {
        try {
            return await prisma.item.findUnique({
                where: {
                    id: itemId
                },
                include: {
                    inventory: {
                        include: {
                            location: true,
                            records: true
                        }
                    }
                }
            });
        } catch (error) {
            throw error;
        }
    }

}
