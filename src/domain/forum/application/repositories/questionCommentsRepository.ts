import { PaginationParams } from '@/core/repositories/paginationParams';
import { QuestionComment } from '../../enterprise/entities/QuestionComment';
import { CommentWithAuthor } from '../../enterprise/entities/valueObjects/CommentWithAuthor';

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>;
  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>;
  abstract create(questionComments: QuestionComment): Promise<void>;
  abstract delete(answerComments: QuestionComment): Promise<void>;
}
