import {Router} from "express";
import {ItemRecordControllers} from "../controllers/item-record.controllers";
import upload from "../middleware/multer";

const router: Router = Router();
const itemRecordController: ItemRecordControllers = new ItemRecordControllers();

// Create a new item record
router.put('/update/:id', upload.single('receipt'), itemRecordController.editItemRecord);

// Get all item records
router.post('/create', itemRecordController.createItemRecord);

// Get an item record by ID
router.delete('/delete/:id', itemRecordController.deleteItemRecord);

export default router;