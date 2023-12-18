import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/Either';
import { QuestionsRepository } from '../repositories/questionsRepository';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';
import { QuestionDetails } from '../../enterprise/entities/valueObjects/questionDetails';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, {
  question: QuestionDetails
}>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
