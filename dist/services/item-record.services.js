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
exports.ItemRecordServices = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ItemRecordServices {
    getItemRecordById(itemRecordId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.itemRecord.findUnique({
                    where: {
                        id: itemRecordId,
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateItemRecord(itemRecordId, itemRecordInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.itemRecord.update({
                    where: {
                        id: itemRecordId,
                    },
                    data: {
                        notes: itemRecordInput.notes,
                        receipt: itemRecordInput.receipt,
                        missing: itemRecordInput.missing,
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteItemRecord(itemRecordId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.itemRecord.delete({
                    where: {
                        id: itemRecordId,
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Create a new item record
    createItemRecord(itemRecordInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdItemRecord = yield prisma.itemRecord.create({
                    data: {
                        itemId: itemRecordInput.itemId,
                        locationId: itemRecordInput.locationId,
                        inventoryId: itemRecordInput.inventoryId,
                    },
                });
                return createdItemRecord;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Check if the inventory has more records
    hasMoreRecords(inventoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recordCount = yield prisma.itemRecord.count({
                    where: {
                        inventoryId: inventoryId,
                    },
                });
                return recordCount > 0;
            }
            catch (error) {
                console.error('Error checking for more records:', error);
                throw error;
            }
        });
    }
}
exports.ItemRecordServices = ItemRecordServices;
