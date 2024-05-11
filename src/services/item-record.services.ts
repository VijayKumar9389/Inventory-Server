import {PrismaClient} from "@prisma/client";
import {UpdateItemRecordDTO} from "../models/item-record.models";
import {CreateItemRecordDTO} from "../models/inventory.models";

const prisma = new PrismaClient();

export class ItemRecordServices {

    public async getItemRecordById(itemRecordId: number): Promise<any> {
        try {
            return await prisma.itemRecord.findUnique({
                where: {
                    id: itemRecordId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    public async updateItemRecord(itemRecordId: number, itemRecordInput: UpdateItemRecordDTO): Promise<any> {
        try {
            return await prisma.itemRecord.update({
                where: {
                    id: itemRecordId,
                },
                data: {
                    notes: itemRecordInput.notes,
                    receipt: itemRecordInput.receipt,
                    missing: itemRecordInput.missing,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    public async deleteItemRecord(itemRecordId: number): Promise<any> {
        try {
            return await prisma.itemRecord.delete({
                where: {
                    id: itemRecordId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    // Create a new item record
    public async createItemRecord(itemRecordInput: CreateItemRecordDTO): Promise<any> {
        try {
            const createdItemRecord = await prisma.itemRecord.create({
                data: {
                    itemId: itemRecordInput.itemId,
                    locationId: itemRecordInput.locationId,
                    inventoryId: itemRecordInput.inventoryId,
                },
            });
            return createdItemRecord;
        } catch (error) {
            throw error;
        }
    }

    // Check if the inventory has more records
    public async hasMoreRecords(inventoryId: number): Promise<boolean> {
        try {
            const recordCount = await prisma.itemRecord.count({
                where: {
                    inventoryId: inventoryId,
                },
            });

            return recordCount > 0;
        } catch (error) {
            console.error('Error checking for more records:', error);
            throw error;
        }
    }

}