import {Router} from "express";
import {ItemControllers} from "../controllers/item.controllers";
import upload from "../middleware/multer";

const router: Router = Router();
const itemController: ItemControllers = new ItemControllers();

// Create a new item
router.post('/create', upload.single('image'), itemController.createItem);

// Get all items
router.get('/getAll', itemController.getAllItems);

// Get an item by ID
router.get('/get/:id', itemController.getItemById);

// Update an item
router.put('/update/:id', upload.single('image'), itemController.updateItem);

// Delete an item
router.delete('/delete/:id', itemController.deleteItem);

export default router;