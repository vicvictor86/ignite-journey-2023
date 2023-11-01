import { Prisma, Question as PrismaQuestion } from '@prisma/client';
import { Question as DomainQuestion } from '@/domain/forum/enterprise/entities/Question';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Slug } from '@/domain/forum/enterprise/entities/valueObjects/Slug';

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): DomainQuestion {
    return DomainQuestion.create({
      authorId: new UniqueEntityId(raw.authorId),
      title: raw.title,
      content: raw.content,
      bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
      slug: Slug.create(raw.slug),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(question: DomainQuestion): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswer?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
    };
  }
}
