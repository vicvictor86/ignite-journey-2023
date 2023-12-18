import { InMemoryAnswersAttachmentsRepository } from 'test/repositories/InMemoryAnswerAttachmentsRepository';
import { InMemoryAnswersRepository } from 'test/repositories/InMemoryAnswersRepository';
import { makeAnswer } from 'test/factories/makeAnswer';
import { InMemoryQuestionsRepository } from 'test/repositories/InMemoryQuestionsRepository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/InMemoryQuestionAttachmentsRepository';
import { InMemoryNotificationsRepository } from 'test/repositories/InMemoryNotificationsRepository';
import { SpyInstance } from 'vitest';
import { makeQuestion } from 'test/factories/makeQuestion';
import { waitFor } from 'test/utils/waitFor';
import { InMemoryAttachmentsRepository } from 'test/repositories/InMemoryAttachmentsRepository';
import { InMemoryStudentsRepository } from 'test/repositories/InMemoryStudentsRepository';
import { AnswerAttachmentsRepository } from '../repositories/answerAttachmentsRepository';
import { AnswersRepository } from '../repositories/answersRepository';
import { SendNotificationUseCase } from '@/domain/notification/application/useCases/sendNotificationUseCase';
import { QuestionsRepository } from '../repositories/questionsRepository';
import { NotificationsRepository } from '@/domain/notification/application/repositories/NotificationsRepository';
import { OnQuestionBestAnswerChosen } from './onQuestionBestAnswerChosen';

let inMemoryQuestionsRepository: QuestionsRepository;
let inMemoryAnswerAttachmentsRepository: AnswerAttachmentsRepository;
let inMemoryAnswersRepository: AnswersRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryNotificationsRepository: NotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationUseCaseSpyOn: SpyInstance;

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswersAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository);

    new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotificationUseCase);

    sendNotificationUseCaseSpyOn = vi.spyOn(sendNotificationUseCase, 'execute');
  });

  it('should be able to notified after chosen a question best answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    question.bestAnswer = answer.id;

    await inMemoryQuestionsRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationUseCaseSpyOn).toHaveBeenCalled();
    });
  });
});
