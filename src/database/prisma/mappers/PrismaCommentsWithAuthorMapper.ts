import { User as PrismaUser, Comment as PrismaComment } from '@prisma/client';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/valueObjects/CommentWithAuthor';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
};

export class PrismaCommentsWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
