import { Prisma, Comment as PrismaAnswerComment } from '@prisma/client';
import { AnswerComment as DomainAnswerComment } from '@/domain/forum/enterprise/entities/AnswerComment';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaAnswerComment): DomainAnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type');
    }

    return DomainAnswerComment.create({
      answerId: new UniqueEntityId(raw.answerId),
      authorId: new UniqueEntityId(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(answerComment: DomainAnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    };
  }
}
