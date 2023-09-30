import { FastifyInstance } from 'fastify';

import { verifyJWT } from './middlewares/verify-jwt';
import { register } from './controllers/users/register';
import { authenticate } from './controllers/users/authenticate';
import { profile } from './controllers/users/profile';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  app.get('/me', { onRequest: [verifyJWT] }, profile);
}
