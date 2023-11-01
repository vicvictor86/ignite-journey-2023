import { makeQuestionComment } from 'test/factories/makeQuestionComment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/InMemoryQuestionCommentsRepositoy';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { FetchQuestionCommentsUseCase } from './fetchQuestionCommentsUseCase';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
    );

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
    );

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
    );

    const result = await sut.execute({
      questionId: 'question-01',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionComments).toHaveLength(3);
  });

  it('should be able to fetch paginated question question comments', async () => {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < 22; i += 1) {
      promises.push(
        inMemoryQuestionCommentsRepository.create(
          makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
        ),
      );
    }

    await Promise.all(promises);

    const result = await sut.execute({
      questionId: 'question-01',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionComments).toHaveLength(2);
  });
});
