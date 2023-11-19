import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/questionAttachmentsRepository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/QuestionAttachment';

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = [];

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    // eslint-disable-next-line arrow-body-style
    const questionAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });

    this.items = questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items
      .filter((item) => item.questionId.toString() !== questionId);

    this.items = questionAttachments;
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items
      .filter((item) => item.questionId.toString() === questionId);

    return questionAttachments;
  }
}
