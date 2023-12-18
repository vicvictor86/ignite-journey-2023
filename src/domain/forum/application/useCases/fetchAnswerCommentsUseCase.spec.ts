import { makeAnswerComment } from 'test/factories/makeAnswerComment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/InMemoryAnswerCommentsRepository';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { makeStudent } from 'test/factories/makeStudent';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { FetchAnswerCommentsUseCase } from './fetchAnswerCommentsUseCase';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Question Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to fetch question question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('question-01'),
        authorId: student.id,
      }),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('question-01'), authorId: student.id }),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('question-01'), authorId: student.id }),
    );

    const result = await sut.execute({
      answerId: 'question-01',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(expect.arrayContaining([
      expect.objectContaining({
        author: 'John Doe',
        authorId: student.id,
      }),
      expect.objectContaining({
        author: 'John Doe',
        authorId: student.id,
      }),
      expect.objectContaining({
        author: 'John Doe',
        authorId: student.id,
      }),
    ]));
  });

  it('should be able to fetch paginated question question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    const promises: Promise<void>[] = [];
    for (let i = 0; i < 22; i += 1) {
      promises.push(
        inMemoryAnswerCommentsRepository.create(
          makeAnswerComment({ answerId: new UniqueEntityId('question-01'), authorId: student.id }),
        ),
      );
    }

    await Promise.all(promises);

    const result = await sut.execute({
      answerId: 'question-01',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });
});
