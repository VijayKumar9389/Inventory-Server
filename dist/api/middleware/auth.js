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
Object.defineProperty(exports, "__esModule", { value: true });
const token_utils_1 = require("../../utils/token.utils");
const validateToken = (checkAdmin) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers.accesstoken; // Access the accessToken header
        if (!authorizationHeader) {
            res.status(401).json({ auth: false, msg: 'Please provide a valid access token' });
            return;
        }
        // Extract the token from the header
        const accessToken = authorizationHeader;
        if (!accessToken) {
            res.status(401).json({ auth: false, msg: 'Access token missing' });
            return;
        }
        // Verify the token
        const user = (0, token_utils_1.validateAccessToken)(accessToken);
        console.log('Valid Token', user);
        if (checkAdmin && !user.isAdmin) {
            res.status(403).json({ auth: false, msg: 'Permission denied. User is not an admin.' });
            return;
        }
        // Attach user info to the request object for further middleware use
        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({ auth: false, msg: 'Token expired' });
        }
        else if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ auth: false, msg: 'Invalid token' });
        }
        else {
            res.status(401).json({ auth: false, msg: 'Failed to verify token' });
        }
    }
});
exports.default = validateToken;
