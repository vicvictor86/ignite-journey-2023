import { NotificationsRepository } from '@/domain/notification/application/repositories/NotificationsRepository';
import { Notification } from '@/domain/notification/enterprise/entities/Notification';

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = [];

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (!notification) {
      return null;
    }

    return notification;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((item) => item.id === notification.id);

    this.items[index] = notification;
  }
}
