import { FastifyInstance } from 'fastify';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { history } from './history';
import { metrics } from './metrics';
import { create } from './create';
import { validate } from './validate';
import { verifyUseRole } from '@/http/middlewares/verify-user-role';

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.get('/check-ins/history', history);
  app.get('/check-ins/metrics', metrics);

  app.post('/gyms/:gymId/check-ins', create);
  app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyUseRole('ADMIN')] }, validate);
}
