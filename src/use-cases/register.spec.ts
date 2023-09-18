import { describe, expect, it } from 'vitest';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RegisterUseCase } from './register';
import { EmailAlreadyExists } from './errors/email-already-exists-error';

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const user = await registerUseCase.execute({
      email: 'test@test.com',
      name: 'test',
      password: 'password',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const user = await registerUseCase.execute({
      email: 'test@test.com',
      name: 'test',
      password: 'password',
    });

    const isPasswordCorrectlyHashed = await compare('password', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const userRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    await registerUseCase.execute({
      email: 'test@test.com',
      name: 'test',
      password: 'password',
    });

    await expect(registerUseCase.execute({
      email: 'test@test.com',
      name: 'test',
      password: 'password',
    })).rejects.toBeInstanceOf(EmailAlreadyExists);
  });
});
