"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRefreshToken = exports.validateAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    const expiresIn = '15min';
    return jsonwebtoken_1.default.sign({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
    }, 'secret', { expiresIn });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    const expiresIn = '1hr';
    return jsonwebtoken_1.default.sign({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
    }, 'secret', { expiresIn });
};
exports.generateRefreshToken = generateRefreshToken;
const validateAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, 'secret');
    }
    catch (error) {
        throw new Error('Invalid access token');
    }
};
exports.validateAccessToken = validateAccessToken;
const validateRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, 'secret');
    }
    catch (error) {
        throw new Error('Invalid refresh token');
    }
};
exports.validateRefreshToken = validateRefreshToken;
