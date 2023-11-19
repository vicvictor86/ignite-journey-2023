import { Injectable } from '@nestjs/common';
import { Attachment } from '@/domain/forum/enterprise/entities/Attachment';
import { PrismaService } from '../prisma.service';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachmentsRepository';
import { PrismaAttachmentMapper } from '../mappers/PrismaAttachmentMapper';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment);

    await this.prisma.attachment.create({
      data,
    });
  }
}
