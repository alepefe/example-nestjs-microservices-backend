import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { StringValueObject } from '../../../shared/domain/value-objects/string.value-object';

export class VerificationCodeCode extends StringValueObject {
  constructor (value: string) {
    super(value);
    this.ensureValueIsValid(value);
  }

  public ensureValueIsValid (value: string): void {
    if (value == null || value.length !== 6) throw new InvalidArgumentError(`Invalid verificationCode ${value}`);
  }
  
  public static generate6DigitCode (): VerificationCodeCode {
    return new VerificationCodeCode(Math.floor(100000 + Math.random() * 900000).toString());
  }
}
