import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/makeStudent';
import { QuestionFactory } from 'test/factories/makeQuestion';
import { AnswerFactory } from 'test/factories/makeAnswer';
import { waitFor } from 'test/utils/waitFor';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/database/prisma/prisma.service';
import { DatabaseModule } from '@/database/database.module';
import { DomainEvents } from '@/core/events/domainEvents';

describe('Choose Question Best Answer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it('should send a notification when question best answer chosen', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    const answerId = answer.id.toString();

    await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

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
