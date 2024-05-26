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
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_utils_1 = require("../utils/token.utils");
const userService = new user_service_1.UserServices();
class UserController {
    // Create a new user
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                if (!user) {
                    throw new Error("Invalid user data");
                }
                const newUser = yield userService.createUser(user);
                res.status(201).json(newUser);
            }
            catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({ error: 'Failed to create user' });
            }
        });
    }
    // Login User
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            // Validate request body
            if (!username || !password) {
                res.status(400).json({ error: 'Username and password are required' });
                return;
            }
            try {
                const result = yield userService.login(username, password);
                res.status(200).json({
                    auth: true,
                    user: result.user,
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                });
            }
            catch (error) {
                console.error('Error during login:', error);
                if (error.message === 'User does not exist' || error.message === 'Incorrect password') {
                    res.status(401).json({ error: error.message });
                }
                else {
                    res.status(500).json({ error: 'Failed to login' });
                }
            }
        });
    }
    //Get all users
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService.getUsers();
                res.status(200).json(users);
            }
            catch (error) {
                console.error('Error getting users:', error);
                res.status(500).json({ error: 'Failed to get users' });
            }
        });
    }
    verifyRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract the refresh token from the 'refreshToken' header
            const refreshToken = req.headers.refreshtoken;
            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token not found' });
                return;
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, 'secret');
                // Assuming the verification is successful, you can send the user data back as well
                res.status(200).json({ auth: true, user: decoded.username });
            }
            catch (error) {
                console.error('Error verifying refresh token:', error);
                // If verification fails, treat it as a logout action
                res.status(403).json({ auth: false, user: '' });
            }
        });
    }
    refreshAccessToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract the refresh token from the 'refreshToken' header
            const refreshToken = req.headers.refreshtoken;
            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token not found' });
                return;
            }
            try {
                // Use the external function to validate the refresh token
                const decoded = (0, token_utils_1.validateRefreshToken)(refreshToken);
                const newAccessToken = jsonwebtoken_1.default.sign({ username: decoded.username }, 'secret', { expiresIn: '1m' });
                res.status(200).json({ accessToken: newAccessToken });
            }
            catch (error) {
                console.error('Error refreshing tokens:', error);
                res.status(403).json({ error: 'Invalid refresh token' });
            }
        });
    }
}
exports.UserController = UserController;
