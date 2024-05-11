import { Request, Response } from "express";
import { UserServices } from "../services/user.service";
import { CreateUserDTO, TokenResponse } from "../models/user.models";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userService: UserServices = new UserServices();

export class UserController {

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user: CreateUserDTO = req.body as CreateUserDTO;
            if (!user) {
                throw new Error("Invalid user data");
            }
            const newUser = await userService.createUser(user);
            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        try {
            const result = await userService.login(username, password);

            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                domain: process.env.COOKIE_DOMAIN || 'localhost',
                maxAge: 1000 * 60, // 1 minute
            });

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                domain: process.env.COOKIE_DOMAIN || 'localhost',
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            });

            res.status(200).json({ auth: true, user: result.user });
        } catch (error: any) {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Failed to login' });
        }
    }

    // Register a new user
    async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ auth: false });
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

    // Refresh the access token
    async refreshTokens(req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ error: 'Refresh token not found' });
            return;
        }

        try {
            const decoded = jwt.verify(refreshToken, 'secret') as any;
            const newAccessToken = jwt.sign({ username: decoded.username }, 'secret', { expiresIn: '1m' });

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                domain: process.env.COOKIE_DOMAIN || 'localhost',
                maxAge: 1000 * 60, // 1 minute
            });

            res.status(200).json({ auth: true });
        } catch (error) {
            console.error('Error refreshing tokens:', error);
            res.status(403).json({ error: 'Invalid refresh token' });
        }
    }
}

