import { Injectable } from '@nestjs/common';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/questionCommentsRepository';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { QuestionComment } from '@/domain/forum/enterprise/entities/QuestionComment';

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.');
  }

  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.');
  }

  create(questionComments: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(answerComments: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
