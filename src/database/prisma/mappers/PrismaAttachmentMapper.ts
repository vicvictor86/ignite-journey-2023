import { Prisma, Attachment as PrismaAttachment } from '@prisma/client';
import { Attachment as DomainAttachment } from '@/domain/forum/enterprise/entities/Attachment';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): DomainAttachment {
    return DomainAttachment.create({
      title: raw.title,
      url: raw.url,
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(attachment: DomainAttachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}
