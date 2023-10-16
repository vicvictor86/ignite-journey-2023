import { InMemoryAnswersAttachmentsRepository } from 'tests/repositories/InMemoryAnswerAttachmentsRepository';
import { InMemoryAnswersRepository } from 'tests/repositories/InMemoryAnswersRepository';
import { makeAnswer } from 'tests/factories/makeAnswer';
import { InMemoryQuestionsRepository } from 'tests/repositories/InMemoryQuestionsRepository';
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/InMemoryQuestionAttachmentsRepository';
import { InMemoryNotificationsRepository } from 'tests/repositories/InMemoryNotificationsRepository';
import { SpyInstance } from 'vitest';
import { makeQuestion } from 'tests/factories/makeQuestion';
import { waitFor } from 'tests/utils/waitFor';
import { AnswerAttachmentsRepository } from '../repositories/answerAttachmentsRepository';
import { AnswersRepository } from '../repositories/answersRepository';
import { OnAnswerCreated } from './onAnswerCreated';
import { SendNotificationUseCase } from '@/domain/notification/application/useCases/sendNotificationUseCase';
import { QuestionsRepository } from '../repositories/questionsRepository';
import { QuestionAttachmentsRepository } from '../repositories/questionAttachmentsRepository';
import { NotificationsRepository } from '@/domain/notification/application/repositories/NotificationsRepository';

let inMemoryQuestionsRepository: QuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: QuestionAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: AnswerAttachmentsRepository;
let inMemoryAnswersRepository: AnswersRepository;
let inMemoryNotificationsRepository: NotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationUseCaseSpyOn: SpyInstance;

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    );
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository);

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);

    sendNotificationUseCaseSpyOn = vi.spyOn(sendNotificationUseCase, 'execute');
  });

  it('should be able to notified after create a answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationUseCaseSpyOn).toHaveBeenCalled();
    });
  });
});
