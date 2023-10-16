import { QuestionsRepository } from '../repositories/questionsRepository';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';
import { Either, left, right } from '@/core/Either';

interface DeleteQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);

    return right({});
  }
}
