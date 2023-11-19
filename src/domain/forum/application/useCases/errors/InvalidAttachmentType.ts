import { UseCaseError } from '@/core/errors/useCaseErrors';

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Type ${identifier} is a invalid attachment type`);
  }
}
