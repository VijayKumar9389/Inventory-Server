import {Request, Response} from "express";
import {UserServices} from "../services/user.service";
import {CreateUserDTO, TokenResponse} from "../models/user.models";
import jwt, {TokenExpiredError} from 'jsonwebtoken';
import {generateAccessToken, validateRefreshToken} from "../utils/token.utils";


export interface UserOutputDTO {
    id: number;
    username: string;
    isAdmin: boolean;
}

const userService: UserServices = new UserServices();

export class UserController {

    // Create a new user
    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user: CreateUserDTO = req.body;
            if (!user) {
                throw new Error("Invalid user data");
            }
            const newUser = await userService.createUser(user);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({error: 'Failed to create user'});
        }
    }

    // Delete a user
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                throw new Error("Invalid user ID");
            }
            const deletedUser = await userService.deleteUser(id);
            res.status(200).json(deletedUser);
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({error: 'Failed to delete user'});
        }
    }

    // Edit a user
    async editUser(req: Request, res: Response): Promise<void> {
        const {id, username, password} = req.body;
        try {
            const user = await userService.editUser(id, username, password);
            res.status(200).json(user);
        } catch (error) {
            console.error('Error editing user:', error);
            res.status(500).json({error: 'Failed to edit user'});
        }
    }

    // Login User
    async login(req: Request, res: Response): Promise<void> {
        const {username, password} = req.body;

        // Validate request body
        if (!username || !password) {
            res.status(400).json({error: 'Username and password are required'});
            return;
        }

        try {
            const result: TokenResponse = await userService.login(username, password);
            res.status(200).json({
                auth: true,
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            });
        } catch (error: any) {
            console.error('Error during login:', error);

            if (error.message === 'User does not exist' || error.message === 'Incorrect password') {
                res.status(401).json({error: error.message});
            } else {
                res.status(500).json({error: 'Failed to login'});
            }
        }
    }

    //Get all users
    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getUsers();
            res.status(200).json(users);
        } catch (error: any) {
            console.error('Error getting users:', error);
            res.status(500).json({error: 'Failed to get users'});
        }
    }

    // Verify refresh token
    async verifyRefreshToken(req: Request, res: Response): Promise<void> {
        // Extract the refresh token from the 'refreshToken' header
        const refreshToken = req.headers.refreshtoken as string | undefined;
        if (!refreshToken) {
            res.status(401).json({error: 'Refresh token not found'});
            return;
        }

        try {
            const decoded = validateRefreshToken(refreshToken) as any;
            // Assuming the verification is successful, you can send the user data back as well
            res.status(200).json({auth: true, user: decoded.username});
        } catch (error) {
            console.error('Error verifying refresh token:', error);
            // If verification fails, treat it as a logout action
            res.status(403).json({auth: false, user: ''});
        }
    }

    // Refresh access token
    async refreshAccessToken(req: Request, res: Response): Promise<void> {
        // Extract the refresh token from the 'refreshToken' header
        const refreshToken = req.headers.refreshtoken as string | undefined;
        if (!refreshToken) {
            res.status(401).json({error: 'Refresh token not found'});
            return;
        }

        try {
            // Use the external function to validate the refresh token
            const decoded = validateRefreshToken(refreshToken) as any;

            // Generate a new access token using the decoded user information
            const newAccessToken = generateAccessToken(decoded);

            res.status(200).json({accessToken: newAccessToken});
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            res.status(403).json({error: 'Invalid refresh token'});
        }
    }

    // Verify admin status using refresh token
    async verifyAdminStatus(req: Request, res: Response): Promise<void> {
        const refreshToken = req.headers.refreshtoken as string | undefined;

        try {
            if (!refreshToken) {
                res.status(401).json({auth: false, error: 'No refresh token provided'});
                return;
            }

            const decodedToken = jwt.verify(refreshToken, 'secret') as jwt.JwtPayload;

            const user: UserOutputDTO = {
                id: decodedToken.id as number,
                isAdmin: decodedToken.isAdmin as boolean,
                username: decodedToken.username as string,
            };

            res.json({auth: user.isAdmin, user: user.username});
        } catch (error) {
            console.error('Error verifying user session:', error);
            if (error instanceof TokenExpiredError) {
                res.status(401).json({auth: false, error: 'Token expired'});
            } else {
                res.status(500).json({auth: false, error: 'Failed to verify session'});
            }
        }
    }
}


