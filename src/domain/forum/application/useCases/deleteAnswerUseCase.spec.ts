import { InMemoryAnswersRepository } from 'tests/repositories/InMemoryAnswersRepository';
import { makeAnswer } from 'tests/factories/makeAnswer';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { DeleteAnswerUseCase } from './deleteAnswerUseCase';
import { NotAllowedError } from './errors/notAllowedErrors';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to delete a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('answer-01'));

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-01',
    });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a answer from other user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-01'),
    }, new UniqueEntityId('answer-01'));

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: 'answer-01',
      authorId: 'author-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
