import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { Password } from '../../domain/auth-strategy/password.value-object';

export interface ChangePasswordParams {
    userId: UserId
    oldPassword: Password
    password: Password
}