import { Either, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/AnswerComment';
import { AnswerCommentsRepository } from '../repositories/answerCommentsRepository';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<null, {
  answerComments: AnswerComment[];
}>;

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
