import { Either, right } from '@/core/Either';
import { Question } from '../../enterprise/entities/Question';
import { QuestionsRepository } from '../repositories/questionsRepository';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<null, {
  questions: Question[];
}>;

export class FetchRecentQuestionsUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({ questions });
  }
}