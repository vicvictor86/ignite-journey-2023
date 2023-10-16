import { DomainEvents } from '@/core/events/domainEvents';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answerAttachmentsRepository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answersRepository';
import { Answer } from '@/domain/forum/enterprise/entities/Answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async save(answer: Answer): Promise<void> {
    const index = this.items.findIndex((item) => item.id === answer.id);

    this.items[index] = answer;
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const index = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(index, 1);
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }
}
