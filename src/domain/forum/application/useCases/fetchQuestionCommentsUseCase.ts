import { Either, right } from '@/core/Either';
import { QuestionComment } from '../../enterprise/entities/QuestionComment';
import { QuestionCommentsRepository } from '../repositories/questionCommentsRepository';

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<null, {
  questionComments: QuestionComment[];
}>;

export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionCommentsRepository
      .findManyByQuestionId(questionId, { page });

    return right({ questionComments });
  }
}
