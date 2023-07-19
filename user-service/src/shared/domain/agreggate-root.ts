/* eslint-disable @typescript-eslint/no-unused-vars */
import { type DomainEvent } from './domain-event';

export abstract class AggregateRoot<T> {
  public props: T;
  private domainEvents: DomainEvent[];

  constructor(props: T) {
    this.props = props;
    this.domainEvents = [];
  }

  pullDomainEvents(): DomainEvent[] {
    const domainEvents = this.domainEvents;
    this.domainEvents = [];
    return domainEvents;
  }

  record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  static fromPrimitives(rawData: any): any {
    throw new Error('Not implemented');
  }

  abstract toPrimitives(): any;
}
