import {
  beforeEach, describe, expect, it,
} from 'vitest';
import { compare } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RegisterUseCase } from './register';
import { EmailAlreadyExists } from './errors/email-already-exists-error';
import { UsersRepository } from '@/repositories/users-repository';

let userRepository: UsersRepository;
let sut: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(userRepository);
  });

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      email: 'test@test.com',
      name: 'test',
      password: 'password',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'test@test.com',
      name: 'test',
      password: 'password',
    });

    const isPasswordCorrectlyHashed = await compare('password', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      email: 'test@test.com',
      name: 'test',
      password: 'password',
    });

    await expect(sut.execute({
      email: 'test@test.com',
      name: 'test',
      password: 'password',
    })).rejects.toBeInstanceOf(EmailAlreadyExists);
  });
});
