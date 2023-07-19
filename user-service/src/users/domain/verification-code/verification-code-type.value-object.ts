import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { StringValueObject } from '../../../shared/domain/value-objects/string.value-object';
import { VERIFICATION_CODE_TYPES, VerificationCodeTypeType } from './verification_code_types.constant';


export class VerificationCodeType extends StringValueObject {
  constructor (value: VerificationCodeTypeType) {
    super(value);
    this.ensureValueIsValid(this.value as VerificationCodeTypeType);
  }

  private ensureValueIsValid (value: string): void {
    if (value == null || !Object.values(VERIFICATION_CODE_TYPES).includes(value as VerificationCodeTypeType)) {
      throw new InvalidArgumentError(`Invalid value for UserRole: ${value}. Allowed values are: ${Object.values(VERIFICATION_CODE_TYPES).join(', ')}`);
    }
  }
}
