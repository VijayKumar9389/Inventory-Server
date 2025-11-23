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
exports.CustomerQuestionController = void 0;
const customer_question_services_1 = require("../services/customer-question.services");
const customerQuestionService = new customer_question_services_1.CustomerQuestionService();
class CustomerQuestionController {
    // Controller method to get all customer questions
    getAllQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questions = yield customerQuestionService.getCustomerQuestions();
                res.status(200).json(questions);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to retrieve questions', error });
            }
        });
    }
    // Controller method to create a new customer question
    createQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, interest, question } = req.body;
                const newQuestion = yield customerQuestionService.createCustomerQuestion({ name, email, interest, question });
                res.status(201).json(newQuestion);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to create question', error });
            }
        });
    }
    // Controller method to update the replied status of a question
    updateRepliedStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { replied } = req.body;
                const updatedQuestion = yield customerQuestionService.updateRepliedStatus(parseInt(id), replied);
                res.status(200).json(updatedQuestion);
            }
            catch (error) {
                res.status(500).json({ message: 'Failed to update replied status', error });
            }
        });
    }
}
exports.CustomerQuestionController = CustomerQuestionController;
