import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Student, StudentProps } from '@/domain/forum/enterprise/entities/Student';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PrismaStudentMapper } from '@/database/prisma/mappers/PrismaStudentMapper';

export function makeStudent(override: Partial<StudentProps> = {}, id?: UniqueEntityId) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return student;
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}) {
    const student = makeStudent(data);

    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    });

    return student;
  }
}
