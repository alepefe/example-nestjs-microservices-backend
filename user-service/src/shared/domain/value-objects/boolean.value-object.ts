import { InvalidArgumentError } from '../invalid-argument.error';
import { ValueObject } from './value-object';

export abstract class BooleanValueObject extends ValueObject {
  readonly value: boolean;

  constructor(value: boolean) {
    super();
    this.ensureValueIsBoolean(value);
    this.value = value;
  }

  public ensureValueIsBoolean(value: boolean): void {
    if (typeof value !== 'boolean') {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${value}>`
      );
    }
  }
}
