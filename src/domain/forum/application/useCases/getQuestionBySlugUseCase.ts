import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/Either';
import { Question } from '../../enterprise/entities/Question';
import { QuestionsRepository } from '../repositories/questionsRepository';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, {
  question: Question;
}>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
