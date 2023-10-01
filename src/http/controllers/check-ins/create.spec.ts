import {
  afterAll, beforeAll, describe, expect, it,
} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/createAndAuthenticateUser';
import { prisma } from '@/lib/prisma';

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const gym = await prisma.gym.create({
      data: {
        title: 'Typescript Gym',
        latitude: -5.9017048,
        longitude: -42.6327866,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: 'Typescript',
        phone: '12193121',
        latitude: -5.9017048,
        longitude: -42.6327866,
      });

    expect(response.statusCode).toEqual(201);
  });
});
