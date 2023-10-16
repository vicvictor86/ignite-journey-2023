import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { Notification, NotificationProps } from '@/domain/notification/enterprise/entities/Notification';

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
