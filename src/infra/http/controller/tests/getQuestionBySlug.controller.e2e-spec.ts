import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/makeStudent';
import { QuestionFactory } from 'test/factories/makeQuestion';
import { AttachmentFactory } from 'test/factories/makeAttachments';
import { QuestionAttachmentFactory } from 'test/factories/makeQuestionAttachments';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/database/database.module';
import { Slug } from '@/domain/forum/enterprise/entities/valueObjects/Slug';

describe('Get Question by Slug (e2e)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question-01',
      slug: Slug.create('question-01'),
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Attachment-01',
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'Question-01',
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Attachment-01',
          }),
        ],
      }),
    });
  });
});
