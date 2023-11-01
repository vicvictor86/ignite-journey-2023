import { makeAnswerComment } from 'test/factories/makeAnswerComment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/InMemoryAnswerCommentsRepository';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { FetchAnswerCommentsUseCase } from './fetchAnswerCommentsUseCase';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Question Question Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to fetch question question comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('question-01') }),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('question-01') }),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('question-01') }),
    );

    const result = await sut.execute({
      answerId: 'question-01',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(3);
  });

  it('should be able to fetch paginated question question comments', async () => {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < 22; i += 1) {
      promises.push(
        inMemoryAnswerCommentsRepository.create(
          makeAnswerComment({ answerId: new UniqueEntityId('question-01') }),
        ),
      );
    }

    await Promise.all(promises);

    const result = await sut.execute({
      answerId: 'question-01',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(2);
  });
});
