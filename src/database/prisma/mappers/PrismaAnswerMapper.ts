import { Prisma, Answer as PrismaAnswer } from '@prisma/client';
import { Answer as DomainAnswer } from '@/domain/forum/enterprise/entities/Answer';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): DomainAnswer {
    return DomainAnswer.create({
      authorId: new UniqueEntityId(raw.authorId),
      questionId: new UniqueEntityId(raw.questionId),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(answer: DomainAnswer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      questionId: answer.questionId.toString(),
      authorId: answer.authorId.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    };
  }
}
