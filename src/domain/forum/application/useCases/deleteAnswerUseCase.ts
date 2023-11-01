import { AnswersRepository } from '../repositories/answersRepository';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';
import { Either, left, right } from '@/core/Either';

interface DeleteAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>;

export class DeleteAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);

    return right(null);
  }
}
