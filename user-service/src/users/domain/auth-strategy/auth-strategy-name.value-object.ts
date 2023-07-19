import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { StringValueObject } from '../../../shared/domain/value-objects/string.value-object';
import { AuthStrategyType, AUTH_STRATEGIES } from './auth-strategies.constant';

export class AuthStrategyName extends StringValueObject {
  constructor (value: AuthStrategyType) {
    super(value);
    this.ensureValueIsValid(value);
  }

  private ensureValueIsValid (value: string): void {
    if (value === '' || !Object.values(AUTH_STRATEGIES).includes(value as AuthStrategyType)) {
      throw new InvalidArgumentError('invalid auth strategy');
    }
  }
}
