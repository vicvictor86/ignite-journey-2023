import { PaginationParams } from '@/core/repositories/paginationParams';
import { QuestionComment } from '../../enterprise/entities/QuestionComment';

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>;
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]>;
  create(questionComments: QuestionComment): Promise<void>;
  delete(answerComments: QuestionComment): Promise<void>;
}
