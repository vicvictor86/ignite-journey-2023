import { InMemoryQuestionsRepository } from 'tests/repositories/InMemoryQuestionsRepository';
import { makeQuestion } from 'tests/factories/makeQuestion';
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/InMemoryQuestionCommentsRepositoy';
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/InMemoryQuestionAttachmentsRepository';
import { CommentOnQuestionUseCase } from './commentOnQuestionUseCase';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment On Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it('should be able to comment in a question', async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'comment-01',
    });

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual('comment-01');
  });
});
