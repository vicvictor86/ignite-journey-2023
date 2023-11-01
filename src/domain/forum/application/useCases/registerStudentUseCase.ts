import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/Either';
import { Student } from '../../enterprise/entities/Student';
import { StudentsRepository } from '../repositories/studentsRepository';
import { StudentAlreadyExistsError } from './errors/studentAlreadyExistsError';
import { HashGenerator } from '../cryptography/hashGenerator';

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<StudentAlreadyExistsError, {
  student: Student;
}>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentsRepository.findByEmail(email);

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      email,
      name,
      password: hashedPassword,
    });

    await this.studentsRepository.create(student);

    return right({ student });
  }
}
