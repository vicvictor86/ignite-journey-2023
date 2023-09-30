import { FastifyReply, FastifyRequest } from 'fastify';
import { makeFetchUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const searchGymUseCase = makeFetchUserMetricsUseCase();

  const { checkInsCount } = await searchGymUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    checkInsCount,
  });
}
