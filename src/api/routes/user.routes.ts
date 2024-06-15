import {Router, Request, Response} from 'express';
import {UserController} from '../../controllers/user.controller';
import validateToken from "../middleware/auth";

const router: Router = Router();
const userController: UserController = new UserController();

// Create a user
router.post('/create', validateToken(true), async (req: Request, res: Response): Promise<void> => {
    await userController.createUser(req, res);
});

//Delete a user
router.delete('/delete/:id', validateToken(true), async (req: Request, res: Response): Promise<void> => {
    await userController.deleteUser(req, res);
});

// Edit a user
router.put('/edit', validateToken(true), async (req: Request, res: Response): Promise<void> => {
    await userController.editUser(req, res);
});

//Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    await userController.login(req, res);
});

//Get all users
router.get('/getAll', validateToken(true), async (req: Request, res: Response): Promise<void> => {
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

// Verify Admin Token
router.post('/verify-admin', async (req: Request, res: Response): Promise<void> => {
    await userController.verifyAdminStatus(req, res);
});

export default router;