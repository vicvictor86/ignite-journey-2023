import { QuestionAttachment } from '../../enterprise/entities/QuestionAttachment';

export interface QuestionAttachmentsRepository {
  deleteManyByQuestionId(questionId: string): Promise<void>;
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
}
