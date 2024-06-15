import {Router} from "express";
import {InventoryControllers} from "../../controllers/inventory.controllers";

const router: Router = Router();
const inventoryController: InventoryControllers = new InventoryControllers();

// Create a new inventory entry
router.post('/create', inventoryController.createInventory);

// Get inventory for a location
router.get('/getByLocation/:locationId', inventoryController.getInventoryByLocationId);

export default router;