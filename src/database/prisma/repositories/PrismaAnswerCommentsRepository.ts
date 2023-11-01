import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answerCommentsRepository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/AnswerComment';

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.');
  }

  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.');
  }

  create(answerComments: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(answerComments: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
