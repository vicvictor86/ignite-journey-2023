import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/makeStudent';
import { QuestionFactory } from 'test/factories/makeQuestion';
import { AttachmentFactory } from 'test/factories/makeAttachments';
import { waitFor } from 'test/utils/waitFor';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/database/prisma/prisma.service';
import { DatabaseModule } from '@/database/database.module';
import { DomainEvents } from '@/core/events/domainEvents';

describe('On Answer Created (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it('should send a notification when question is answered', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionId = question.id.toString();

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New Answer',
        attachments: [],
      });

    await waitFor(async () => {
      const notificationsOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      });

      expect(notificationsOnDatabase).toBeTruthy();
    });
  });
});
