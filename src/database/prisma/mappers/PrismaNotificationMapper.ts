import { Prisma, Notification as PrismaNotification } from '@prisma/client';
import { Notification as DomainNotification } from '@/domain/notification/enterprise/entities/Notification';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): DomainNotification {
    return DomainNotification.create({
      recipientId: new UniqueEntityId(raw.recipientId),
      title: raw.title,
      content: raw.content,
      createdAt: raw.createdAt,
      readAt: raw.readAt,
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(notification: DomainNotification): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    };
  }
}
