import { InMemoryQuestionsRepository } from 'tests/repositories/InMemoryQuestionsRepository';
import { makeQuestion } from 'tests/factories/makeQuestion';
import { GetQuestionBySlugUseCase } from './getQuestionBySlugUseCase';
import { Slug } from '../../enterprise/entities/valueObjects/Slug';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('new-slug'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: 'new-slug',
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.question).toEqual(newQuestion);
      expect(result.value.question.slug).toEqual(newQuestion.slug);
    }
  });
});
