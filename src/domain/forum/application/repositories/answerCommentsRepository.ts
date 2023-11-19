import { PaginationParams } from '@/core/repositories/paginationParams';
import { AnswerComment } from '../../enterprise/entities/AnswerComment';

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>;
  abstract create(answerComments: AnswerComment): Promise<void>;
  abstract delete(answerComments: AnswerComment): Promise<void>;
}
