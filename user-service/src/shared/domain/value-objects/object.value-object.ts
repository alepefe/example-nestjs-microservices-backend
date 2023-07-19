import { ValueObject } from './value-object';

export abstract class ObjectValueObject<T> extends ValueObject {
  readonly value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  public toString(): string {
    return JSON.stringify(this.value);
  }
}
