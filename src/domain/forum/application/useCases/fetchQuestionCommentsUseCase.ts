import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/Either';
import { QuestionCommentsRepository } from '../repositories/questionCommentsRepository';
import { CommentWithAuthor } from '../../enterprise/entities/valueObjects/CommentWithAuthor';

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<null, {
  comments: CommentWithAuthor[];
}>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments = await this.questionCommentsRepository
      .findManyByQuestionIdWithAuthor(questionId, { page });

    return right({ comments });
  }
}
