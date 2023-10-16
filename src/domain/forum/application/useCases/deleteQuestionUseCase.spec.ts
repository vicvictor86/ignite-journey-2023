import { InMemoryQuestionsRepository } from 'tests/repositories/InMemoryQuestionsRepository';
import { makeQuestion } from 'tests/factories/makeQuestion';
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/InMemoryQuestionAttachmentsRepository';
import { makeQuestionAttachments } from 'tests/factories/makeQuestionAttachemnts';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { DeleteQuestionUseCase } from './deleteQuestionUseCase';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('question-01'));

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachments({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachments({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    await sut.execute({
      questionId: 'question-01',
      authorId: 'author-01',
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from other user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('question-01'));

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId: 'question-01',
      authorId: 'author-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
