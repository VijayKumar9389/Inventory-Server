import {Router, Request, Response} from 'express';
import {UserController} from '../controllers/user.controller';

const router: Router = Router();
const userController: UserController = new UserController();

// Create a user
router.post('/create', async (req: Request, res: Response): Promise<void> => {
    await userController.createUser(req, res);
});

//Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    await userController.login(req, res);
});

//Get all users
router.get('/getAll', async (req: Request, res: Response): Promise<void> => {
    await userController.getUsers(req, res);
});

//Refresh Token
router.post('/refresh-accessToken', async (req: Request, res: Response): Promise<void> => {
    await userController.refreshAccessToken(req, res);
});

// Verify the refresh token
router.post('/verify-token', async (req: Request, res: Response): Promise<void> => {
    await userController.verifyRefreshToken(req, res);
});

export default router;