import { InvalidArgumentError } from './invalid-argument.error';
import { Uuid } from './value-objects/uuid.value-object';

export interface DomainEventPrimitives {
  eventName: string;
  eventId: string;
  occurredOn: Date;
  body: any;
}
export class DomainEventHandlerError extends Error {
  readonly domainEvent: DomainEvent;

  constructor(domainEvent: DomainEvent, message?: string) {
    super(message);
    this.domainEvent = domainEvent;
    this.name = this.constructor.name;
  }
}

export abstract class DomainEvent {
  static EVENT_NAME: string;
  static fromPrimitives: (...args: any[]) => any;
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;

  constructor(eventName: string, eventId?: string, occurredOn?: Date) {
    this.eventId = eventId != null ? eventId : Uuid.random().toString();
    this.occurredOn = occurredOn != null ? occurredOn : new Date();
    this.eventName = eventName;
    this.ensureDomainEventIsValid();
  }

  private ensureDomainEventIsValid(): void {
    if (this.eventId == null)
      throw new InvalidArgumentError('Domain event has no eventId');
    if (this.occurredOn == null)
      throw new InvalidArgumentError('Domain event has no occurredOn');
    if (this.eventName == null)
      throw new InvalidArgumentError('Domain event has no eventName');
  }

  abstract toPrimitives(): DomainEventPrimitives;
}

export interface DomainEventClass {
  EVENT_NAME: string;
  fromPrimitives: (...args: any[]) => DomainEvent;
}
