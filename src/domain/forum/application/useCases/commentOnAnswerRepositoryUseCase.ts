import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/Either';
import { UniqueEntityId } from '../../../../core/entities/UniqueEntityId';
import { AnswerComment } from '../../enterprise/entities/AnswerComment';
import { AnswerCommentsRepository } from '../repositories/answerCommentsRepository';
import { AnswersRepository } from '../repositories/answersRepository';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<ResourceNotFoundError, {
  answerComment: AnswerComment;
}>;

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({
      answerComment,
    });
  }
}
