import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Notification, NotificationProps } from '@/domain/notification/enterprise/entities/Notification';
import { PrismaService } from '@/database/prisma/prisma.service';
import { PrismaNotificationMapper } from '@/database/prisma/mappers/PrismaNotificationMapper';

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(6),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  );

  return notification;
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(data: Partial<NotificationProps> = {}) {
    const notification = makeNotification(data);

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
