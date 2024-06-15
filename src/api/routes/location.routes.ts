import { Router, Request, Response } from 'express'; 
import { LocationController } from '../../controllers/location.controllers';

const router: Router = Router();
const locationController: LocationController = new LocationController();
``
// Define routes
router.get('/getAll', async (req: Request, res: Response): Promise<void> => {
    await locationController.getAllLocationsController(req, res);
});

// Create a new location
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    await locationController.createLocationController(req, res);
});

// Update a location
router.put('/update/:id', async (req: Request, res: Response): Promise<void> => {
    await locationController.updateLocation(req, res);
});

// Delete a location
router.delete('/delete/:id', async (req: Request, res: Response): Promise<void> => {
    await locationController.deleteLocation(req, res);
});

// Get a location by ID
router.get('/get/:id', async (req: Request, res: Response): Promise<void> => {
    await locationController.getLocationByIdController(req, res);
});

export default router;
