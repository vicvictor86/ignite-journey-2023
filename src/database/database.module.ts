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

@Module({
  providers: [
    PrismaService,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaAnswersRepository,
    StudentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    QuestionsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
  ],
})
export class DatabaseModule { }
