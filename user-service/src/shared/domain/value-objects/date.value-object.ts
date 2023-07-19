import { ValueObject } from './value-object';

export class DateValueObject extends ValueObject {
  readonly value: Date;

  constructor(value: Date = new Date()) {
    super();
    this.value = value;
  }

  toString(): string {
    return this.value.toString();
  }

  toTimestamp(): number {
    return this.value.getTime();
  }

  toUTCString(): string {
    return this.value.toUTCString();
  }

  toISOString(): string {
    return this.value.toISOString();
  }
}
