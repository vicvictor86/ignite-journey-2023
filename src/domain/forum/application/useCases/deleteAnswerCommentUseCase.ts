import { Either, left, right } from '@/core/Either';
import { AnswerCommentsRepository } from '../repositories/answerCommentsRepository';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';

interface DeleteAnswerCommentsUseCaseRequest {
  authorId: string;
  commentId: string;
}

type DeleteAnswerCommentsUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {}>;

export class DeleteAnswerCommentsUseCase {
  constructor(
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    commentId,
  }: DeleteAnswerCommentsUseCaseRequest): Promise<DeleteAnswerCommentsUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findById(commentId);

    if (!answerComments) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answerComments.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answerCommentsRepository.delete(answerComments);

    return right({});
  }
}
