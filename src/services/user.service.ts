import {PrismaClient, User} from "@prisma/client";
import {CreateUserDTO, TokenResponse} from "../models/user.models";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {generateAccessToken, generateRefreshToken} from "../utils/token.utils";

export class UserServices {

    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // Create a new user
    async createUser(userInput: CreateUserDTO): Promise<User> {
        // Hash the password
        const saltRounds: number = 10;
        const hashedPassword: string = await bcrypt.hash(userInput.password, saltRounds);

        try {
            return await this.prisma.user.create({
                data: {
                    username: userInput.username,
                    password: hashedPassword
                }
            });
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Get all users
    async getUsers(): Promise<User[]> {
        try {
            return await this.prisma.user.findMany();
        } catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    }

    // Login user
    async login(username: string, password: string): Promise<TokenResponse> {
        try {
            // Find the user by name
            const user = await this.prisma.user.findUnique({
                where: {username},
            });

            // Check if the user exists
            if (!user) {
                throw new Error('User does not exist');
            }

            // Compare the password with the hashed password
            const passwordMatch: boolean = await bcrypt.compare(password, user.password);

            // If the password does not match, throw an error
            if (!passwordMatch) {
                throw new Error('Incorrect password');
            }

            // Generate an access token and a refresh token
            const token: string = generateAccessToken(user);
            const refreshToken: string = generateRefreshToken(user);
            console.log(`${user.username} successfully logged in`);

            return {
                auth: true,
                accessToken: token,
                refreshToken: refreshToken,
                user: user.username,
            };

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    // // Generate an access token
    // private generateAccessToken(user: any): string {
    //     const secretKey = 'secret';
    //     const expiresIn = '1min';
    //
    //     return jwt.sign(
    //         {
    //             id: user.id,
    //             username: user.username,
    //             isAdmin: user.isAdmin,
    //         },
    //         secretKey,
    //         {expiresIn}
    //     );
    // }

}