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
exports.CustomerQuestionService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CustomerQuestionService {
    // Method to get all customer questions
    getCustomerQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = yield prisma.customerQuestion.findMany();
            return questions.map(question => ({
                id: question.id,
                name: question.name,
                email: question.email,
                interest: question.interest,
                question: question.question,
                replied: question.replied,
                createdAt: question.createdAt,
            }));
        });
    }
    // Method to update the replied status of a question
    updateRepliedStatus(id, replied) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedQuestion = yield prisma.customerQuestion.update({
                where: { id: id },
                data: { replied: replied },
            });
            return {
                id: updatedQuestion.id,
                name: updatedQuestion.name,
                email: updatedQuestion.email,
                interest: updatedQuestion.interest,
                question: updatedQuestion.question,
                replied: updatedQuestion.replied,
                createdAt: updatedQuestion.createdAt,
            };
        });
    }
    // Method to create a new customer question
    createCustomerQuestion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newQuestion = yield prisma.customerQuestion.create({
                data: {
                    name: data.name,
                    email: data.email,
                    interest: data.interest,
                    question: data.question,
                    replied: false, // Default value, assuming the question is not replied to yet
                    createdAt: new Date(),
                },
            });
            return {
                id: newQuestion.id,
                name: newQuestion.name,
                email: newQuestion.email,
                interest: newQuestion.interest,
                question: newQuestion.question,
                replied: newQuestion.replied,
                createdAt: newQuestion.createdAt,
            };
        });
    }
}
exports.CustomerQuestionService = CustomerQuestionService;
