import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/Either';
import { Notification } from '../../enterprise/entities/Notification';
import { NotificationsRepository } from '../repositories/NotificationsRepository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  notification: Notification;
}>;

@Injectable()
export class ReadNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({ notification });
  }
}
