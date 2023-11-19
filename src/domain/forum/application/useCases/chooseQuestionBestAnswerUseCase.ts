import { Injectable } from '@nestjs/common';
import { Question } from '../../enterprise/entities/Question';
import { AnswersRepository } from '../repositories/answersRepository';
import { QuestionsRepository } from '../repositories/questionsRepository';
import { ResourceNotFoundError } from '../../../../core/errors/resourceNotFound';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';
import { Either, left, right } from '@/core/Either';

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  question: Question;
}
>;

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionsRepository.findById(answer.questionId.toString());

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    question.bestAnswer = answer.id;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
