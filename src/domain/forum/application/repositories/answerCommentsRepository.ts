import { PaginationParams } from '@/core/repositories/paginationParams';
import { AnswerComment } from '../../enterprise/entities/AnswerComment';
import { CommentWithAuthor } from '../../enterprise/entities/valueObjects/CommentWithAuthor';

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>;
  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>;
  abstract create(answerComments: AnswerComment): Promise<void>;
  abstract delete(answerComments: AnswerComment): Promise<void>;
}
