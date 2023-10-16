import { InMemoryAnswerCommentsRepository } from 'tests/repositories/InMemoryAnswerCommentsRepository';
import { makeAnswerComment } from 'tests/factories/makeAnswerComment';
import { DeleteAnswerCommentsUseCase } from './deleteAnswerCommentUseCase';
import { NotAllowedError } from '../../../../core/errors/notAllowedErrors';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentsUseCase;

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to delete a question', async () => {
    const newAnswerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    await sut.execute({
      authorId: newAnswerComment.authorId.toString(),
      commentId: newAnswerComment.id.toString(),
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from other user', async () => {
    const newAnswerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(newAnswerComment);

    const result = await sut.execute({
      authorId: 'other-user',
      commentId: newAnswerComment.id.toString(),
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).instanceof(NotAllowedError);
  });
});
