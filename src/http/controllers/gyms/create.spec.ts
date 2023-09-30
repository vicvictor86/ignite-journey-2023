import {
  afterAll, beforeAll, describe, expect, it,
} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/createAndAuthenticateUser';

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post('/gyms')
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
