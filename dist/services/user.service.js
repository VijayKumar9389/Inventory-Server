"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_utils_1 = require("../utils/token.utils");
class UserServices {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    // Create a new user
    createUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(userInput.password, saltRounds);
            try {
                return yield this.prisma.user.create({
                    data: {
                        username: userInput.username,
                        password: hashedPassword
                    }
                });
            }
            catch (error) {
                console.error('Error creating user:', error);
                throw error;
            }
        });
    }
    // Get all users
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.user.findMany();
            }
            catch (error) {
                console.error('Error getting users:', error);
                throw error;
            }
        });
    }
    // Login user
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the user by name
                const user = yield this.prisma.user.findUnique({
                    where: { username },
                });
                // Check if the user exists
                if (!user) {
                    throw new Error('User does not exist');
                }
                // Compare the password with the hashed password
                const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
                // If the password does not match, throw an error
                if (!passwordMatch) {
                    throw new Error('Incorrect password');
                }
                // Generate an access token and a refresh token
                const token = (0, token_utils_1.generateAccessToken)(user);
                const refreshToken = (0, token_utils_1.generateRefreshToken)(user);
                console.log(`${user.username} successfully logged in`);
                return {
                    auth: true,
                    accessToken: token,
                    refreshToken: refreshToken,
                    user: user.username,
                };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.UserServices = UserServices;
