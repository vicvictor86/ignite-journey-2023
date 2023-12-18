import { User as PrismaUser, Question as PrismaQuestion, Attachment as PrismaAttachment } from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/valueObjects/questionDetails';
import { Slug } from '@/domain/forum/enterprise/entities/valueObjects/Slug';
import { PrismaAttachmentMapper } from './PrismaAttachmentMapper';

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
};

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      title: raw.title,
      slug: Slug.create(raw.slug),
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
