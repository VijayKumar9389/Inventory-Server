import { Request, Response } from 'express';
import { CustomerQuestionService} from "../services/customer-question.services";

const customerQuestionService = new CustomerQuestionService();

export class CustomerQuestionController {

    // Controller method to get all customer questions
    async getAllQuestions(req: Request, res: Response) {
        try {
            const questions = await customerQuestionService.getCustomerQuestions();
            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ message: 'Failed to retrieve questions', error });
        }
    }

    // Controller method to create a new customer question
    async createQuestion(req: Request, res: Response) {
        try {
            const { name, email, interest, question } = req.body;
            const newQuestion = await customerQuestionService.createCustomerQuestion({ name, email, interest, question });
            res.status(201).json(newQuestion);
        } catch (error) {
            res.status(500).json({ message: 'Failed to create question', error });
        }
    }

    // Controller method to update the replied status of a question
    async updateRepliedStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { replied } = req.body;
            const updatedQuestion = await customerQuestionService.updateRepliedStatus(parseInt(id), replied);
            res.status(200).json(updatedQuestion);
        } catch (error) {
            res.status(500).json({ message: 'Failed to update replied status', error });
        }
    }
}