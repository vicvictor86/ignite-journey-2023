import { Injectable } from '@nestjs/common';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/questionAttachmentsRepository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/QuestionAttachment';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionAttachmentMapper } from '../mappers/PrismaQuestionAttachmentMapper';

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const attachmentsId = attachments.map((attachment) => attachment.id.toString());

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsId,
        },
      },
    });
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    const questionsAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });

    return questionsAttachments.map(PrismaQuestionAttachmentMapper.toDomain);
  }
}
