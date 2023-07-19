import { InvalidArgumentError } from '../invalid-argument.error';
import { ValueObject } from './value-object';

export class EmailAddress extends ValueObject {
  readonly value: string;

  constructor(value: string) {
    super();
    this.value = value;
    this.ensureEmailIsValid(value);
  }

  toString(): string {
    return this.value;
  }

  ensureEmailIsValid(value: string): void {
    const regularEmail = /^[a-zA-Z0-9.+-_]+@[a-zA-Z0-9-_]+\.[a-zA-Z0-9-.]+$/;
    const emailWithAlias =
      /^"[a-zA-Z0-9-._\s]+"\s<[a-zA-Z0-9-._]+@[a-zA-Z0-9-_]+\.[a-zA-Z0-9-.]+>$/;

    if (
      value == null ||
      (!regularEmail.test(value) && !emailWithAlias.test(value))
    ) {
      throw new InvalidArgumentError(value);
    }
  }
}
