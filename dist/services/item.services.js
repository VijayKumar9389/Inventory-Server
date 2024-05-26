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
exports.ItemServices = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ItemServices {
    // Create a new item
    createItem(itemInput) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.item.create({
                    data: {
                        name: itemInput.name,
                        description: itemInput.description,
                        image: itemInput.image,
                        value: itemInput.value,
                    },
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get all items
    getAllItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.item.findMany({
                    include: {
                        inventory: {
                            include: {
                                location: true,
                                records: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateItem(itemId, itemData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.item.update({
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteItem(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.item.delete({
                    where: {
                        id: itemId
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getItemById(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.item.findUnique({
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
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ItemServices = ItemServices;
