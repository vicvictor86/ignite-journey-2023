import { Either, right } from '@/core/either';
import { UniqueEntityId } from '../../../../core/entities/UniqueEntityId';
import { Question } from '../../enterprise/entities/Question';
import { QuestionsRepository } from '../repositories/questionsRepository';

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
}

type CreateQuestionUseCaseResponse = Either<null, {
  question: Question;
}>;

export class CreateQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    authorId, title, content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityId(authorId),
      title,
      content,
    });

    await this.questionsRepository.create(question);

    return right({ question });
  }
}
