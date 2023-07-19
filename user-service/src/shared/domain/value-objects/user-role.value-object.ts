import { USER_ROLES, UserRoleType } from '../constants/user-roles.constant';
import { InvalidArgumentError } from '../invalid-argument.error';
import { StringValueObject } from './string.value-object';

export class UserRole extends StringValueObject {
  constructor(value: UserRoleType) {
    super(value);
    this.ensureValueIsValid(this.value);
  }

  private ensureValueIsValid(value: string): void {
    if (
      value == null ||
      !Object.values(USER_ROLES).includes(value as UserRoleType)
    ) {
      throw new InvalidArgumentError(
        `Invalid value for UserRole: ${value}. Allowed values are: ${Object.values(
          USER_ROLES,
        ).join(', ')}`,
      );
    }
  }
}
