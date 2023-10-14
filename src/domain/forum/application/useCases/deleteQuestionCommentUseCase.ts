import { Either, left, right } from '@/core/either';
import { QuestionCommentsRepository } from '../repositories/questionCommentsRepository';
import { ResourceNotFoundError } from './errors/resourceNotFound';
import { NotAllowedError } from './errors/notAllowedErrors';

interface DeleteQuestionCommentsUseCaseRequest {
  authorId: string;
  commentId: string;
}

type DeleteQuestionCommentsUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

export class DeleteQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    commentId,
  }: DeleteQuestionCommentsUseCaseRequest): Promise<DeleteQuestionCommentsUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(commentId);

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== questionComment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);

    return right({});
  }
}
