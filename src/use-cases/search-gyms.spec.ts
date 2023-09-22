import {
  beforeEach, describe, expect, it,
} from 'vitest';

import { SearchGymsUseCase } from './search-gyms';
import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: GymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Typescript Gym',
      latitude: 0,
      longitude: 0,
    });

    await gymsRepository.create({
      title: 'Javascript Gym',
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await sut.execute({
      query: 'Typescript Gym',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Typescript Gym' })]);
  });

  it('should be able to fetch paginated gym search', async () => {
    const createGymsPromises = [];
    for (let i = 1; i <= 22; i += 1) {
      createGymsPromises.push(gymsRepository.create({
        title: `Javascript Gym ${i}`,
        latitude: 0,
        longitude: 0,
      }));
    }

    await Promise.all(createGymsPromises);

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ]);
  });
});
