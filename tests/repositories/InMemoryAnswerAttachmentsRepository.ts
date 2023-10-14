import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answerAttachmentsRepository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/AnswerAttachment';

export class InMemoryAnswersAttachmentsRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = [];

  async deleteManyByAnswerId(answerId: string) {
    const answersAttachments = this.items
      .filter((item) => item.answerId.toString() !== answerId);

    this.items = answersAttachments;
  }

  async findManyByAnswerId(answerId: string) {
    const answersAttachments = this.items
      .filter((item) => item.answerId.toString() === answerId);

    return answersAttachments;
  }
}
