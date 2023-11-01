import { UseCaseError } from '@/core/errors/useCaseErrors';

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Credentials is not valid');
  }
}
