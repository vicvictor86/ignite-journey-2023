import { Injectable } from '@nestjs/common';
import { QuestionCommentsRepository } from '../repositories/questionCommentsRepository';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';
import { Either, left, right } from '@/core/Either';

interface DeleteQuestionCommentsUseCaseRequest {
  authorId: string;
  commentId: string;
}

type DeleteQuestionCommentsUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>;

@Injectable()
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
