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
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
// Create a user
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.createUser(req, res);
}));
//Login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.login(req, res);
}));
//Get all users
router.get('/getAll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.getUsers(req, res);
}));
//Refresh Token
router.post('/refresh-accessToken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.refreshAccessToken(req, res);
}));
// Verify the refresh token
router.post('/verify-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.verifyRefreshToken(req, res);
}));
exports.default = router;
