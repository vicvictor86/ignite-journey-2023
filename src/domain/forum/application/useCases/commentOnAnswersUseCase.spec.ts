/* eslint-disable max-len */
import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswersRepository';
import { makeAnswer } from 'test/factories/makeAnswer';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/InMemoryAnswerCommentsRepository';
import { InMemoryAnswersAttachmentsRepository } from 'test/repositories/InMemoryAnswerAttachmentsRepository';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { CommentOnAnswerUseCase } from './commentOnAnswerRepositoryUseCase';

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment On Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository);
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository);
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  it('should be able to comment in a answer', async () => {
    const answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'comment-01',
    });

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('comment-01');
  });
});
