import { InMemoryAnswersRepository } from 'tests/repositories/InMemoryAnswersRepository';
import { makeAnswer } from 'tests/factories/makeAnswer';
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/InMemoryAnswerCommentsRepository';
import { InMemoryAnswersAttachmentsRepository } from 'tests/repositories/InMemoryAnswerAttachmentsRepository';
import { CommentOnAnswerUseCase } from './commentOnAnswerRepository';

let inMemoryAnswersAttachmentsRepository: InMemoryAnswersAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment On Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentsRepository = new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository);
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
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
