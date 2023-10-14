import { InMemoryQuestionsRepository } from 'tests/repositories/InMemoryQuestionsRepository';
import { makeQuestion } from 'tests/factories/makeQuestion';
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/InMemoryQuestionAttachmentsRepository';
import { FetchRecentQuestionsUseCase } from './fetchRecentQuestionsUseCase';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 20) }),
    );

    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 18) }),
    );

    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2023, 0, 23) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent questions', async () => {
    const promises = [];
    for (let i = 0; i < 22; i += 1) {
      promises.push(
        inMemoryQuestionsRepository.create(
          makeQuestion({ createdAt: new Date(2023, 0, 20) }),
        ),
      );
    }

    await Promise.all(promises);

    const result = await sut.execute({
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questions).toHaveLength(2);
  });
});
