import { ValueObject } from './value-object';

export abstract class StringValueObject extends ValueObject {
  readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  toString(): string {
    return this.value;
  }
}
