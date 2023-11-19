import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { PrismaService } from '@/database/prisma/prisma.service';
import { AnswerAttachment, AnswerAttachmentProps } from '@/domain/forum/enterprise/entities/AnswerAttachment';

export function makeAnswerAttachments(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const answerAttachments = AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return answerAttachments;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswerAttachment(data: Partial<AnswerAttachmentProps> = {}) {
    const answerAttachment = makeAnswerAttachments(data);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    });

    return answerAttachment;
  }
}
