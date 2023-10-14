import { InMemoryQuestionsRepository } from 'tests/repositories/InMemoryQuestionsRepository';
import { makeQuestion } from 'tests/factories/makeQuestion';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { EditQuestionUseCase } from './editQuestionUseCase';
import { NotAllowedError } from './errors/notAllowedErrors';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('question-01'));

    await inMemoryQuestionsRepository.create(newQuestion);

    await sut.execute({
      questionId: 'question-01',
      authorId: 'author-01',
      content: 'other content',
      title: 'other title',
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'other title',
      content: 'other content',
    });
  });

  it('should not be able to edit a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('question-01'));

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: 'question-01',
      authorId: 'author-02',
      content: 'other content',
      title: 'other title',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
