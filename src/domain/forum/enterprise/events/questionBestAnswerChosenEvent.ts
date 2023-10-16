import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { DomainEvent } from '@/core/events/domainEvent';
import { Question } from '../entities/Question';

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date;

  public question: Question;

  public bestAnswerId: UniqueEntityId;

  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this.question = question;
    this.bestAnswerId = bestAnswerId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id;
  }
}
