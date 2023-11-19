import { Prisma, Attachment as PrismaQuestionAttachment } from '@prisma/client';
import { QuestionAttachment as DomainQuestionAttachment, QuestionAttachment } from '@/domain/forum/enterprise/entities/QuestionAttachment';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaQuestionAttachment): DomainQuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type');
    }

    return DomainQuestionAttachment.create({
      attachmentId: new UniqueEntityId(raw.id),
      questionId: new UniqueEntityId(raw.questionId),
    }, new UniqueEntityId(raw.id));
  }

  static toPrismaUpdateMany(attachments: QuestionAttachment[]): Prisma.AttachmentUpdateManyArgs {
    const attachmentsId = attachments.map((attachment) => attachment.attachmentId.toString());

    return {
      where: {
        id: {
          in: attachmentsId,
        },
      },
      data: {
        questionId: attachments[0].questionId.toString(),
      },
    };
  }
}
