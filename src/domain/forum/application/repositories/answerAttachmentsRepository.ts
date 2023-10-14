import { AnswerAttachment } from '../../enterprise/entities/AnswerAttachment';

export interface AnswerAttachmentsRepository {
  deleteManyByAnswerId(answerId: string): Promise<void>;
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
}
