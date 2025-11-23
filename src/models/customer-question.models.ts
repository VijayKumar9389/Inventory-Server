export interface CustomerQuestionDTO {
    id: number;
    name: string;
    email: string;
    interest: string;
    question: string;
    replied: boolean;
    createdAt: Date;
}