import { PaginationParams } from '@/core/repositories/paginationParams';
import { Answer } from '../../enterprise/entities/Answer';

export abstract class AnswersRepository {
  abstract findById(id: string): Promise<Answer | null>;
  abstract findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>;
  abstract save(answer: Answer): Promise<void>;
  abstract create(answer: Answer): Promise<void>;
  abstract delete(answer: Answer): Promise<void>;
}
