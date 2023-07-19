import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { Phone } from '../../../shared/domain/value-objects/phone.value-object';
import { AuthStrategyName } from '../../domain/auth-strategy/auth-strategy-name.value-object';
import { AuthStrategyProviderId } from '../../domain/auth-strategy/auth-strategy-provider-id.value-object';
import { Password } from '../../domain/auth-strategy/password.value-object';
import { EmailVerified } from '../../domain/email-verified.value-object';
import { Name } from '../../domain/name.value-object';
import { Surname } from '../../domain/surname.value-object';

export interface RegisterUserParams {
    authStrategy: AuthStrategyName
    email: EmailAddress
    password?: Password
    name?: Name
    surname?: Surname
    phone?: Phone
    providerId?: AuthStrategyProviderId
    emailVerified?: EmailVerified;
    fcmToken?: string
}