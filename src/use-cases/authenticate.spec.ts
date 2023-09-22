import {
  beforeEach, describe, expect, it,
} from 'vitest';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';
import { UsersRepository } from '@/repositories/users-repository';

let userRepository: UsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(userRepository);
  });

  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'test',
      email: 'test@test.com',
      password_hash: await hash('password', 6),
    });

    const { user } = await sut.execute({
      email: 'test@test.com',
      password: 'password',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(sut.execute({
      email: 'test@test.com',
      password: 'password',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'test',
      email: 'test@test.com',
      password_hash: await hash('password', 6),
    });

    await expect(sut.execute({
      email: 'test@test.com',
      password: 'wrong-password',
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
