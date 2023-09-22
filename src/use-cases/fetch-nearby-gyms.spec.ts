import {
  beforeEach, describe, expect, it,
} from 'vitest';

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { GymsRepository } from '@/repositories/gyms-repository';

let gymsRepository: GymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch nearby gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Nearby gym',
      latitude: -5.0484524,
      longitude: -42.8112537,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -5.9017048,
      longitude: -42.6327866,
    });

    const { gyms } = await sut.execute({
      userLatitude: -5.0451987,
      userLongitude: -42.8173389,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Nearby gym' })]);
  });
});
