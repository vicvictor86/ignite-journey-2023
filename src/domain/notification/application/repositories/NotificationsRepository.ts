import { Notification } from '../../enterprise/entities/Notification';

export interface NotificationsRepository {
  findById(id: string): Promise<Notification | null>;
  create(notification: Notification): Promise<void>;
  save(notification: Notification): Promise<void>;
}
