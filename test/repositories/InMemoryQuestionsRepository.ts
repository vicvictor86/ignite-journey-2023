/* eslint-disable max-len */
import { DomainEvents } from '@/core/events/domainEvents';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questionsRepository';
import { Question } from '@/domain/forum/enterprise/entities/Question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/valueObjects/questionDetails';
import { InMemoryAttachmentsRepository } from './InMemoryAttachmentsRepository';
import { InMemoryStudentsRepository } from './InMemoryStudentsRepository';
import { InMemoryQuestionAttachmentsRepository } from './InMemoryQuestionAttachmentsRepository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

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

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    const author = this.studentsRepository.items.find((student) => student.id.equals(question.authorId));

    if (!author) {
      throw new Error(`Author with ID "${question.authorId.toString()} does not exist`);
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter((questionAttachment) => questionAttachment.questionId.equals(question.id));

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((item) => item.id.equals(questionAttachment.attachmentId));

      if (!attachment) {
        throw new Error(`Attachment with ID "${questionAttachment.attachmentId.toString()} does not exist`);
      }

      return attachment;
    });

    return QuestionDetails.create({
      authorId: question.authorId,
      questionId: question.authorId,
      bestAnswerId: question.bestAnswer,
      title: question.title,
      content: question.content,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: author.name,
      attachments,
      slug: question.slug,
    });
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

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    );

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async create(question: Question) {
    this.items.push(question);

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    const index = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(index, 1);
    this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());
  }
}
