import { InMemoryNotificationsRepository } from 'test/repositories/InMemoryNotificationsRepository';
import { SendNotificationUseCase } from './sendNotificationUseCase';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      content: 'New Notification',
      title: 'New Notification Title',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(result.value?.notification);
  });
});
