import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/Answer';
import { PrismaAnswerMapper } from '@/database/prisma/mappers/PrismaAnswerMapper';
import { PrismaService } from '@/database/prisma/prisma.service';

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueEntityId) {
  const question = Answer.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
}

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}) {
    const answer = makeAnswer(data);

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    return answer;
  }
}
