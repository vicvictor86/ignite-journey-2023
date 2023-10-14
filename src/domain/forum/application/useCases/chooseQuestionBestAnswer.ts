import { Either, left, right } from '@/core/either';
import { Question } from '../../enterprise/entities/Question';
import { AnswersRepository } from '../repositories/answersRepository';
import { QuestionsRepository } from '../repositories/questionsRepository';
import { ResourceNotFoundError } from './errors/resourceNotFound';
import { NotAllowedError } from './errors/notAllowedErrors';

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  question: Question;
}
>;

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

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}