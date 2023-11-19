import { Injectable } from '@nestjs/common';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/questionCommentsRepository';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { QuestionComment } from '@/domain/forum/enterprise/entities/QuestionComment';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionCommentMapper } from '../mappers/PrismaQuestionCommentMapper';
import { PrismaCommentsWithAuthorMapper } from '../mappers/PrismaCommentsWithAuthorMapper';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/valueObjects/CommentWithAuthor';

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!questionComment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionsComment = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questionsComment.map(PrismaQuestionCommentMapper.toDomain);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionsComment = await this.prisma.comment.findMany({
      where: {
        questionId,
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

    return questionsComment.map(PrismaCommentsWithAuthorMapper.toDomain);
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(answerComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    });
  }
}
