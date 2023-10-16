import { DomainEvents } from '@/core/events/domainEvents';
import { EventHandler } from '@/core/events/eventHandler';
import { AnswerCreateEvent } from '../../enterprise/events/answerCreateEvent';
import { QuestionsRepository } from '../repositories/questionsRepository';
import { SendNotificationUseCase } from '@/domain/notification/application/useCases/sendNotificationUseCase';

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendAnswerNotification.bind(this),
      AnswerCreateEvent.name,
    );
  }

  private async sendAnswerNotification({ answer }: AnswerCreateEvent) {
    const question = await this.questionsRepository.findById(answer.questionId.toString());

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em ${question.title.substring(0, 40).concat('...')}`,
        content: question.excerpt,
      });
    }
  }
}
