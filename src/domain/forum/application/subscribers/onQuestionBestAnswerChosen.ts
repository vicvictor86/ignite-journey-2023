import { DomainEvents } from '@/core/events/domainEvents';
import { EventHandler } from '@/core/events/eventHandler';
import { QuestionBestAnswerChosenEvent } from '../../enterprise/events/questionBestAnswerChosenEvent';
import { AnswersRepository } from '../repositories/answersRepository';
import { SendNotificationUseCase } from '@/domain/notification/application/useCases/sendNotificationUseCase';

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendBestAnswerChosenNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }

  async sendBestAnswerChosenNotification({
    bestAnswerId,
    question,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(bestAnswerId.toString());

    if (answer) {
      this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida',
        content: `Sua resposta na pergunta ${question.title.substring(0, 40).concat('...')} 
        foi selecionada como a melhor resposta`,
      });
    }
  }
}
