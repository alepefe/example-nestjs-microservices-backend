import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { AuthStrategyName } from '../../domain/auth-strategy/auth-strategy-name.value-object';
import { Password } from '../../domain/auth-strategy/password.value-object';


export interface AuthenticateUserParams {
  authStrategy: AuthStrategyName
  email?: EmailAddress
  password?: Password
  refreshToken?: string
  idToken?: string
  accessToken?: string
  fcmToken?: string
}
