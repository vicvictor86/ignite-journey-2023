import { InMemoryAnswersRepository } from 'tests/repositories/InMemoryAnswersRepository';
import { makeAnswer } from 'tests/factories/makeAnswer';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { EditAnswerUseCase } from './editAnswerUseCase';
import { NotAllowedError } from './errors/notAllowedErrors';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('answer-01'));

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-01',
      content: 'other content',
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'other content',
    });
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
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
