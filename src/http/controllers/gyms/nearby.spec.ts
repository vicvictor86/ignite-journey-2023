import {
  afterAll, beforeAll, describe, expect, it,
} from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/createAndAuthenticateUser';

describe('Nearby Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search for nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Javascript',
        phone: '12193121',
        latitude: -5.9017048,
        longitude: -42.6327866,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: 'Typescript',
        phone: '12193121',
        latitude: -5.0484524,
        longitude: -42.8112537,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -5.0451987,
        longitude: -42.8173389,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Gym' }),
    ]);
  });
});
