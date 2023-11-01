import { Prisma, User as PrismaStudent } from '@prisma/client';
import { Student as DomainStudent } from '@/domain/forum/enterprise/entities/Student';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): DomainStudent {
    return DomainStudent.create({
      email: raw.email,
      name: raw.name,
      password: raw.password,
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(student: DomainStudent): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      email: student.email,
      name: student.name,
      password: student.password,
    };
  }
}
