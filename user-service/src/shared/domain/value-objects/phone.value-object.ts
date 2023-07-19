import { InvalidArgumentError } from '../invalid-argument.error';
import { StringValueObject } from './string.value-object';

export class Phone extends StringValueObject {
  constructor(value: string) {
    super(value.replace(/\s+/g, ''));
    this.ensureValueIsValid(this.value);
  }

  private ensureValueIsValid(value: string): void {
    if (value === '') {
      throw new InvalidArgumentError();
    }
  }
}
