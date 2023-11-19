import { QuestionAttachment } from '../../enterprise/entities/QuestionAttachment';

export abstract class QuestionAttachmentsRepository {
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>;
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>;

  abstract deleteManyByQuestionId(questionId: string): Promise<void>;
  abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
}
