import { Prisma, Comment as PrismaQuestionComment } from '@prisma/client';
import { QuestionComment as DomainQuestionComment } from '@/domain/forum/enterprise/entities/QuestionComment';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaQuestionComment): DomainQuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type');
    }

    return DomainQuestionComment.create({
      questionId: new UniqueEntityId(raw.questionId),
      authorId: new UniqueEntityId(raw.authorId),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(questionComment: DomainQuestionComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
      questionId: questionComment.questionId.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    };
  }
}
