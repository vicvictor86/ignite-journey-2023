import { Injectable } from '@nestjs/common';
import { Either, right } from '@/core/Either';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Notification } from '../../enterprise/entities/Notification';
import { NotificationsRepository } from '../repositories/NotificationsRepository';

interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

type SendNotificationUseCaseResponse = Either<null, {
  notification: Notification;
}>;

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return right({ notification });
  }
}
