import { PaginationParams } from '@/core/repositories/paginationParams';
import { Answer } from '../../enterprise/entities/Answer';

export interface AnswersRepository {
  findById(id: string): Promise<Answer | null>;
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>;
  save(answer: Answer): Promise<void>;
  create(answer: Answer): Promise<void>;
  delete(answer: Answer): Promise<void>;
}
