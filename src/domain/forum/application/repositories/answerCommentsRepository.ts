import { PaginationParams } from '@/core/repositories/paginationParams';
import { AnswerComment } from '../../enterprise/entities/AnswerComment';

export interface AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>;
  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>;
  create(answerComments: AnswerComment): Promise<void>;
  delete(answerComments: AnswerComment): Promise<void>;
}
