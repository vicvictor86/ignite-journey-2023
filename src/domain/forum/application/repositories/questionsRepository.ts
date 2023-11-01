import { PaginationParams } from '@/core/repositories/paginationParams';
import { Question } from '../../enterprise/entities/Question';

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findManyRecent(paginationParams: PaginationParams): Promise<Question[]>;
  abstract save(question: Question): Promise<void>;
  abstract create(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
}
