import { PrismaClient } from '@prisma/client';
import { CustomerQuestionDTO } from "../models/customer-question.models";

const prisma = new PrismaClient();

export class CustomerQuestionService {

    // Method to get all customer questions
    async getCustomerQuestions(): Promise<CustomerQuestionDTO[]> {
        const questions = await prisma.customerQuestion.findMany();
        return questions.map(question => ({
            id: question.id,
            name: question.name,
            email: question.email,
            interest: question.interest,
            question: question.question,
            replied: question.replied,
            createdAt: question.createdAt,
        }));
    }

    // Method to update the replied status of a question
    async updateRepliedStatus(id: number, replied: boolean): Promise<CustomerQuestionDTO | null> {
        const updatedQuestion = await prisma.customerQuestion.update({
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
    }

    // Method to create a new customer question
    async createCustomerQuestion(data: {
        name: string;
        email: string;
        interest: string;
        question: string;
    }): Promise<CustomerQuestionDTO> {
        const newQuestion = await prisma.customerQuestion.create({
            data: {
                name: data.name,
                email: data.email,
                interest: data.interest,
                question: data.question,
                replied: false,  // Default value, assuming the question is not replied to yet
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
    }
}