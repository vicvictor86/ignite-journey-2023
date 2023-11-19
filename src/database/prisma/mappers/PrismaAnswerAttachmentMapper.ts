import { Prisma, Attachment as PrismaAnswerAttachment } from '@prisma/client';
import { AnswerAttachment, AnswerAttachment as DomainAnswerAttachment } from '@/domain/forum/enterprise/entities/AnswerAttachment';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAnswerAttachment): DomainAnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type');
    }

    return DomainAnswerAttachment.create({
      attachmentId: new UniqueEntityId(raw.id),
      answerId: new UniqueEntityId(raw.answerId),
    }, new UniqueEntityId(raw.id));
  }

  static toPrismaUpdateMany(attachments: AnswerAttachment[]): Prisma.AttachmentUpdateManyArgs {
    const attachmentsId = attachments.map((attachment) => attachment.attachmentId.toString());

    return {
      where: {
        id: {
          in: attachmentsId,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    };
  }
}
