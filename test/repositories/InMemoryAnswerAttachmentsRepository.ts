import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answerAttachmentsRepository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/AnswerAttachment';

export class InMemoryAnswersAttachmentsRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = [];

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    // eslint-disable-next-line arrow-body-style
    const answerAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = answerAttachments;
  }

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
