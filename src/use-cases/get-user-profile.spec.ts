import {
  beforeEach, describe, expect, it,
} from 'vitest';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let userRepository: UsersRepository;
let sut: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(userRepository);
  });

  it('should be able to get user profile', async () => {
    const userCreated = await userRepository.create({
      name: 'test',
      email: 'test@test.com',
      password_hash: await hash('password', 6),
    });

    const { user } = await sut.execute({
      userId: userCreated.id,
    });

    expect(user.name).toEqual(userCreated.name);
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(sut.execute({
      userId: 'not-existing-id',
    })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
