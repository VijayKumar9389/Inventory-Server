"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
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
    // Delete a user
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                if (!id) {
                    throw new Error("Invalid user ID");
                }
                const deletedUser = yield userService.deleteUser(id);
                res.status(200).json(deletedUser);
            }
            catch (error) {
                console.error('Error deleting user:', error);
                res.status(500).json({ error: 'Failed to delete user' });
            }
        });
    }
    // Edit a user
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, username, password } = req.body;
            try {
                const user = yield userService.editUser(id, username, password);
                res.status(200).json(user);
            }
            catch (error) {
                console.error('Error editing user:', error);
                res.status(500).json({ error: 'Failed to edit user' });
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
    // Verify refresh token
    verifyRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract the refresh token from the 'refreshToken' header
            const refreshToken = req.headers.refreshtoken;
            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token not found' });
                return;
            }
            try {
                const decoded = (0, token_utils_1.validateRefreshToken)(refreshToken);
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
    // Refresh access token
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
                // Generate a new access token using the decoded user information
                const newAccessToken = (0, token_utils_1.generateAccessToken)(decoded);
                res.status(200).json({ accessToken: newAccessToken });
            }
            catch (error) {
                console.error('Error refreshing tokens:', error);
                res.status(403).json({ error: 'Invalid refresh token' });
            }
        });
    }
    // Verify admin status using refresh token
    verifyAdminStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.headers.refreshtoken;
            try {
                if (!refreshToken) {
                    res.status(401).json({ auth: false, error: 'No refresh token provided' });
                    return;
                }
                const decodedToken = jsonwebtoken_1.default.verify(refreshToken, 'secret');
                const user = {
                    id: decodedToken.id,
                    isAdmin: decodedToken.isAdmin,
                    username: decodedToken.username,
                };
                res.json({ auth: user.isAdmin, user: user.username });
            }
            catch (error) {
                console.error('Error verifying user session:', error);
                if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                    res.status(401).json({ auth: false, error: 'Token expired' });
                }
                else {
                    res.status(500).json({ auth: false, error: 'Failed to verify session' });
                }
            }
        });
    }
}
exports.UserController = UserController;
