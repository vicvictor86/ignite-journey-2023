import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswersRepository';
import { makeAnswer } from 'test/factories/makeAnswer';
import { InMemoryAnswersAttachmentsRepository } from 'test/repositories/InMemoryAnswerAttachmentsRepository';
import { FetchQuestionsAnswersUseCase } from './fetchQuestionAnswersUseCase';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionsAnswersUseCase;

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository);
    sut = new FetchQuestionsAnswersUseCase(inMemoryAnswersRepository);
  });

  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-01') }),
    );

    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-01') }),
    );

    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-01') }),
    );

    const result = await sut.execute({
      questionId: 'question-01',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(3);
  });

  it('should be able to fetch paginated question answers', async () => {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < 22; i += 1) {
      promises.push(
        inMemoryAnswersRepository.create(
          makeAnswer({ questionId: new UniqueEntityId('question-01') }),
        ),
      );
    }

    await Promise.all(promises);

    const result = await sut.execute({
      questionId: 'question-01',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(2);
  });
});
