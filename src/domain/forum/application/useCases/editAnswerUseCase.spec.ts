import { InMemoryAnswersRepository } from 'tests/repositories/InMemoryAnswersRepository';
import { makeAnswer } from 'tests/factories/makeAnswer';
import { InMemoryAnswersAttachmentsRepository } from 'tests/repositories/InMemoryAnswerAttachmentsRepository';
import { makeAnswerAttachments } from 'tests/factories/makeAnswersAttachments';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { EditAnswerUseCase } from './editAnswerUseCase';
import { NotAllowedError } from './errors/notAllowedErrors';

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository);
    sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswersAttachmentsRepository);
  });

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('answer-01'));

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswersAttachmentsRepository.items.push(
      makeAnswerAttachments({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachments({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-01',
      content: 'other content',
      attachmentsId: ['1', '3'],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'other content',
    });
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ]);
  });

  it('should not be able to edit a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('answer-01'));

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-02',
      content: 'other content',
      attachmentsId: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
