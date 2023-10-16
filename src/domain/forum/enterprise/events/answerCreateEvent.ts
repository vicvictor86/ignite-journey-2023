import { UniqueEntityId } from '@/core/entities/UniqueEntityId';
import { DomainEvent } from '@/core/events/domainEvent';
import { Answer } from '../entities/Answer';

export class AnswerCreateEvent implements DomainEvent {
  public ocurredAt: Date;

  public answer: Answer;

  constructor(answer: Answer) {
    this.answer = answer;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.answer.id;
  }
}
