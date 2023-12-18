import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/Either';
import { AnswerCommentsRepository } from '../repositories/answerCommentsRepository';
import { CommentWithAuthor } from '../../enterprise/entities/valueObjects/CommentWithAuthor';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<null, {
  comments: CommentWithAuthor[];
}>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments = await this.answerCommentsRepository
      .findManyByAnswerIdWithAuthor(answerId, { page });

    return right({ comments });
  }
}
