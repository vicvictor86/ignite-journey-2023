import { InMemoryQuestionsRepository } from 'test/repositories/InMemoryQuestionsRepository';
import { makeQuestion } from 'test/factories/makeQuestion';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/InMemoryQuestionAttachmentsRepository';
import { makeQuestionAttachment } from 'test/factories/makeQuestionAttachments';
import { InMemoryAttachmentsRepository } from 'test/repositories/InMemoryAttachmentsRepository';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { EditQuestionUseCase } from './editQuestionUseCase';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    );
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('question-01'));

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    await sut.execute({
      questionId: 'question-01',
      authorId: 'author-01',
      content: 'other content',
      title: 'other title',
      attachmentsIds: ['1', '3'],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'other title',
      content: 'other content',
    });
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ]);
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
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should be able to sync and removed attachments when editing a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('question-01'));

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    const result = await sut.execute({
      questionId: 'question-01',
      authorId: 'author-01',
      content: 'other content',
      title: 'other title',
      attachmentsIds: ['1', '3'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('3'),
        }),
      ]),
    );
  });
});
