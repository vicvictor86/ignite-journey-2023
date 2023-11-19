import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachmentsRepository';
import { Attachment } from '@/domain/forum/enterprise/entities/Attachment';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  // constructor(
  //   private answerAttachmentsRepository: AnswerAttachmentsRepository,
  // ) {}

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}
