import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeCheckInsUseCase } from '@/use-cases/factories/make-create-check-ins-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInsBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const {
    latitude, longitude,
  } = createCheckInsBodySchema.parse(request.body);
  const { gymId } = createCheckInParamsSchema.parse(request.params);

  const registerUseCase = makeCheckInsUseCase();

  await registerUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
