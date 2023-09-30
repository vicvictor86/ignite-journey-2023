import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { GetUserMetricsUseCase } from '../get-user-metrics';

export function makeFetchUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();

  const useCase = new GetUserMetricsUseCase(checkInsRepository);

  return useCase;
}
