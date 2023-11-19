import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/PrismaAnswerAttachmentsRepository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/PrismaAnswerCommentsRepository';
import { PrismaAnswersRepository } from './prisma/repositories/PrismaAnswersRepository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/PrismaQuestionCommentsRepository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/PrismaQuestionAttachmentsRepository';
import { PrismaQuestionsRepository } from './prisma/repositories/PrismaQuestionsRepository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questionsRepository';
import { StudentsRepository } from '@/domain/forum/application/repositories/studentsRepository';
import { PrismaStudentsRepository } from './prisma/repositories/PrismaStudentsRepository';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/questionAttachmentsRepository';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/questionCommentsRepository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answersRepository';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answerAttachmentsRepository';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answerCommentsRepository';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachmentsRepository';
import { PrismaAttachmentsRepository } from './prisma/repositories/PrismaAttachmentsRepository';

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    AnswersRepository,
    StudentsRepository,
    AnswerAttachmentsRepository,
    AnswerCommentsRepository,
    QuestionsRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    AttachmentsRepository,
  ],
})
export class DatabaseModule { }
