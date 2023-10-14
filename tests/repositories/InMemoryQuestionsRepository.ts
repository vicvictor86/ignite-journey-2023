import { PaginationParams } from '@/core/repositories/paginationParams';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questionsRepository';
import { Question } from '@/domain/forum/enterprise/entities/Question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async save(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id === question.id);

    this.items[index] = question;
  }

  async create(question: Question) {
    this.items.push(question);
  }

  async delete(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(index, 1);
  }
}
