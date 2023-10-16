import { UseCaseError } from '@/core/errors/useCaseErrors';

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed');
  }
}
