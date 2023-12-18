import { InMemoryQuestionsRepository } from 'test/repositories/InMemoryQuestionsRepository';
import { makeQuestion } from 'test/factories/makeQuestion';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/InMemoryQuestionAttachmentsRepository';
import { InMemoryAttachmentsRepository } from 'test/repositories/InMemoryAttachmentsRepository';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { makeStudent } from 'test/factories/makeStudent';
import { makeAttachment } from 'test/factories/makeAttachments';
import { makeQuestionAttachment } from 'test/factories/makeQuestionAttachments';
import { GetQuestionBySlugUseCase } from './getQuestionBySlugUseCase';
import { Slug } from '../../enterprise/entities/valueObjects/Slug';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create('new-slug'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const attachment = makeAttachment({ title: 'Some Attachment' });

    inMemoryAttachmentsRepository.items.push(attachment);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: attachment.id,
      }),
    );

    const result = await sut.execute({
      slug: 'new-slug',
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Some Attachment',
          }),
        ],
      }),
    });
  });
});
