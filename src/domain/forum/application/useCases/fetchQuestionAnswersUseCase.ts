import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/Either';
import { Answer } from '../../enterprise/entities/Answer';
import { AnswersRepository } from '../repositories/answersRepository';

interface FetchQuestionsAnswersUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionsAnswersUseCaseResponse = Either<null, {
  answers: Answer[];
}>;

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionsAnswersUseCaseRequest): Promise<FetchQuestionsAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page });

    return right({ answers });
  }
}
