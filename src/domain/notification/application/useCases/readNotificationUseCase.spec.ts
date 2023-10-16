import { InMemoryNotificationsRepository } from 'tests/repositories/InMemoryNotificationsRepository';
import { makeNotification } from 'tests/factories/makeNotification';
import { ReadNotificationUseCase } from './readNotificationUseCase';
import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeNotification();

    inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(expect.any(Date));
  });

  it('should not be able to read a notification from other user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-01'),
    });

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-02',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
