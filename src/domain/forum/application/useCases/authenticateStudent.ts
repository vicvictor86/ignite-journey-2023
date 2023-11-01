import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/Either';
import { StudentsRepository } from '../repositories/studentsRepository';
import { StudentAlreadyExistsError } from './errors/studentAlreadyExistsError';
import { HashComparer } from '../cryptography/hashComparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrongCredetialsErrors';

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<StudentAlreadyExistsError, {
  accessToken: string;
}>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isPasswordMatch = await this.hashComparer.compare(password, student.password);

    if (!isPasswordMatch) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({ sub: student.id.toString() });

    return right({ accessToken });
  }
}
