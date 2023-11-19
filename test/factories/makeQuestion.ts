import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities/Question';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PrismaQuestionMapper } from '@/database/prisma/mappers/PrismaQuestionMapper';

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityId) {
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps> = {}) {
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
