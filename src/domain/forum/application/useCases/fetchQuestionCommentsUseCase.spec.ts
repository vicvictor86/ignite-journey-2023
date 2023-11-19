import { makeQuestionComment } from 'test/factories/makeQuestionComment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/InMemoryQuestionCommentsRepositoy';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { makeStudent } from 'test/factories/makeStudent';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { FetchQuestionCommentsUseCase } from './fetchQuestionCommentsUseCase';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    const question1 = makeQuestionComment({ questionId: new UniqueEntityId('question-01'), authorId: student.id });
    const question2 = makeQuestionComment({ questionId: new UniqueEntityId('question-01'), authorId: student.id });
    const question3 = makeQuestionComment({ questionId: new UniqueEntityId('question-01'), authorId: student.id });

    await inMemoryQuestionCommentsRepository.create(question1);

    await inMemoryQuestionCommentsRepository.create(question2);

    await inMemoryQuestionCommentsRepository.create(question3);

    const result = await sut.execute({
      questionId: 'question-01',
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
        inMemoryQuestionCommentsRepository.create(
          makeQuestionComment({ questionId: new UniqueEntityId('question-01'), authorId: student.id }),
        ),
      );
    }

    await Promise.all(promises);

    const result = await sut.execute({
      questionId: 'question-01',
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });
});
