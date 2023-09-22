import {
  beforeEach, describe, expect, it,
} from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: GymsRepository;
let sut: CreateGymUseCase;

describe('CreateGym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Typescript Gym',
      description: '',
      latitude: 0,
      longitude: 0,
      phone: '',
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
