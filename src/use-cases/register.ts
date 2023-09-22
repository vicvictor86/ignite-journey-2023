import { hash } from 'bcryptjs';

import { User } from '@prisma/client';
import { UsersRepository } from '@/repositories/users-repository';
import { EmailAlreadyExists } from './errors/email-already-exists-error';

interface RegisterUseCaseRequest {
  email: string;
  name: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new EmailAlreadyExists();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash: passwordHash,
    });

    return { user };
  }
}
