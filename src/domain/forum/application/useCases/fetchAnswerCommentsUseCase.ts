import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/Either';
import { AnswerComment } from '../../enterprise/entities/AnswerComment';
import { AnswerCommentsRepository } from '../repositories/answerCommentsRepository';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<null, {
  answerComments: AnswerComment[];
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
    const answerComments = await this.answerCommentsRepository
      .findManyByAnswerId(answerId, { page });

    return right({ answerComments });
  }
}
