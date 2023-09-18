import { hash } from 'bcryptjs';

import { UsersRepository } from '@/repositories/users-repository';
import { EmailAlreadyExists } from './errors/email-already-exists-error';

interface RegisterUseCaseParams {
  email: string;
  name: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseParams) {
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

    return user;
  }
}
