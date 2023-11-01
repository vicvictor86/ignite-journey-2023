import { vi } from 'vitest';
import { UniqueEntityId } from '../entities/UniqueEntityId';
import { AggregateRoot } from '../entities/aggregateRoot';
import { DomainEvent } from './domainEvent';
import { DomainEvents } from './domainEvents';

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;

  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn();

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Criando uma resposta porém sem salvar no banco
    const aggregate = CustomAggregate.create();

    // Assegurando que o evento foi criado porém não foi disparado
    expect(aggregate.domainEvents).toHaveLength(1);

    // Salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
