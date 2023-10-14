import { PaginationParams } from '@/core/repositories/paginationParams';
import { Question } from '../../enterprise/entities/Question';

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
  findManyRecent(paginationParams: PaginationParams): Promise<Question[]>
  save(question: Question): Promise<void>;
  create(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
}
