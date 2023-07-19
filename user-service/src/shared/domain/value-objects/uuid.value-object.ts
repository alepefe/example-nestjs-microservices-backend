import { v4, validate } from 'uuid';
import { InvalidArgumentError } from '../invalid-argument.error';
import { ValueObject } from './value-object';

export class Uuid extends ValueObject {
  readonly value: string;

  constructor(value: string) {
    super();
    this.ensureIsValidUuid(value);
    this.value = value;
  }

  static random(): Uuid {
    return new Uuid(v4());
  }

  private ensureIsValidUuid(id: string): void {
    if (id == null || !validate(id)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${id}>`,
      );
    }
  }

  public equals(uuid: Uuid): boolean {
    return this.toString() === uuid.toString();
  }

  toString(): string {
    return this.value;
  }
}
