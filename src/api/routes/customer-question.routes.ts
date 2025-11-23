import { Router } from 'express';
import { CustomerQuestionController} from "../../controllers/customer-question.controllers";
import validateToken from "../middleware/auth";

const router = Router();
const customerQuestionController = new CustomerQuestionController();

// Route to get all customer questions
router.get('/questions', customerQuestionController.getAllQuestions);

// Route to create a new customer question
router.post('/create', customerQuestionController.createQuestion);

// Route to update the replied status of a question
router.patch('/questions/:id/replied', validateToken(false), customerQuestionController.updateRepliedStatus);

export default router;