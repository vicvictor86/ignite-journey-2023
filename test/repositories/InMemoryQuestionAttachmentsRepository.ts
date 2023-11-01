import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/questionAttachmentsRepository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/QuestionAttachment';

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = [];

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
