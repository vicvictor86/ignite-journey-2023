import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PrismaAttachmentMapper } from '@/database/prisma/mappers/PrismaAttachmentMapper';
import { Attachment, AttachmentProps } from '@/domain/forum/enterprise/entities/Attachment';

export function makeAttachment(override: Partial<AttachmentProps> = {}, id?: UniqueEntityId) {
  const attachment = Attachment.create(
    {
      title: faker.person.fullName(),
      url: faker.internet.email(),
      ...override,
    },
    id,
  );

  return attachment;
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(data: Partial<AttachmentProps> = {}) {
    const attachment = makeAttachment(data);

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    });

    return attachment;
  }
}
