import {Inventory, Item, Location} from "@prisma/client";

export interface ItemWithInventory extends Item {
    inventory: InventoryWithRecords[];
}

export interface InventoryWithRecords extends Inventory {
    records: ItemRecord[];
    location: Location;
}

export interface ItemRecord {
    id: number;
    receipt?: string;
    notes?: string;
    missing: boolean;
    item: Item;
    location: Location;
    inventory?: Inventory;
}

// New item input to database
export interface CreateItemDTO {
    name: string;
    description: string;
    image?: string; // Path to the image file, made optional
}

// New item upload File to the server
export interface UploadItemDTO {
    name: string;
    description: string;
    value: number;
    image: Express.Multer.File | null; // Multer file object
}

export interface UpdateItemDTO {
    name: string;
    description: string | null; // Allow null for description
    image?: string | null; // Allow null for image
    value: number;
}

// Inventory input to create a new inventory record
export interface CreateInventoryDTO {
    locationId: number;
    itemId: number;
}

export interface InventoryWithItem extends Inventory {
    item: Item;
}

export interface LocationWithInventory extends Location {
    inventory: InventoryWithItem[];
}

export interface LocationWithRecords extends Location {
    records: ItemRecord[];
    items: Item;
}

export interface CreateLocationDTO {
    name: string;
    description?: string;
}

export interface CreateItemRecordDTO {
    itemId: number;
    locationId: number;
    inventoryId: number;
}


