/* eslint-disable max-len */
import { makeQuestionComment } from 'test/factories/makeQuestionComment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/InMemoryQuestionCommentsRepositoy';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { DeleteQuestionCommentsUseCase } from './deleteQuestionCommentUseCase';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: DeleteQuestionCommentsUseCase;

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository);
    sut = new DeleteQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to delete a question', async () => {
    const newQuestionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      commentId: newQuestionComment.id.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from other user', async () => {
    const newQuestionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const result = await sut.execute({
      authorId: 'other-user',
      commentId: newQuestionComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
