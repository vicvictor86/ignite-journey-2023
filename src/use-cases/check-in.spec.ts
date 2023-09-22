import {
  afterEach,
  beforeEach, describe, expect, it, vi,
} from 'vitest';
import { Decimal } from '@prisma/client/runtime/library';

import { CheckInUseCase } from './check-in';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { MaxNumberCheckInsError } from './errors/max-number-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInsRepository: CheckInsRepository;
let gymsRepository: GymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-1',
      title: 'JavaScrypt gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: 0,
      userLongitude: 0,
    })).rejects.toBeInstanceOf(MaxNumberCheckInsError);
  });

  it('should be able to check in twice on different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0));

    await expect(sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: 0,
      userLongitude: 0,
    })).resolves.toBeTruthy();
  });

  it('should not be able to check in a distance gym', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await gymsRepository.create({
      id: 'gym-2',
      title: 'Typescript gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    await expect(sut.execute({
      gymId: 'gym-2',
      userId: 'user-1',
      userLatitude: 10000,
      userLongitude: 8000,
    })).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
