import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answerCommentsRepository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/AnswerComment';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerCommentMapper } from '../mappers/PrismaAnswerCommentMapper';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/valueObjects/CommentWithAuthor';
import { PrismaCommentsWithAuthorMapper } from '../mappers/PrismaCommentsWithAuthorMapper';

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!answerComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answersComment = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answersComment.map(PrismaAnswerCommentMapper.toDomain);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answersComment = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answersComment.map(PrismaCommentsWithAuthorMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    });
  }
}
