"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_question_controllers_1 = require("../../controllers/customer-question.controllers");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
const customerQuestionController = new customer_question_controllers_1.CustomerQuestionController();
// Route to get all customer questions
router.get('/questions', customerQuestionController.getAllQuestions);
// Route to create a new customer question
router.post('/create', customerQuestionController.createQuestion);
// Route to update the replied status of a question
router.patch('/questions/:id/replied', (0, auth_1.default)(false), customerQuestionController.updateRepliedStatus);
exports.default = router;
