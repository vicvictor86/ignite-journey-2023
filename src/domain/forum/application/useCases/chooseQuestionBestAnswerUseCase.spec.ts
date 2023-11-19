import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswersRepository';
import { makeAnswer } from 'test/factories/makeAnswer';
import { InMemoryQuestionsRepository } from 'test/repositories/InMemoryQuestionsRepository';
import { makeQuestion } from 'test/factories/makeQuestion';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/InMemoryQuestionAttachmentsRepository';
import { InMemoryAnswersAttachmentsRepository } from 'test/repositories/InMemoryAnswerAttachmentsRepository';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { ChooseQuestionBestAnswerUseCase } from './chooseQuestionBestAnswerUseCase';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository);
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );
  });

  it('should be able to choose a question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    });

    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryAnswersRepository.create(answer);
    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionsRepository.items[0].bestAnswer).toEqual(answer.id);
  });

  it('should not be able to to choose a question best answer from other user', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    });

    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryAnswersRepository.create(answer);
    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
