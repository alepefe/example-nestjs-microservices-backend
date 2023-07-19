import { Password } from 'src/users/domain/auth-strategy/password.value-object';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { VerificationCodeCode } from 'src/users/domain/verification-code/verification-code-code.value-object';

export interface ResetPasswordParams {
    email: EmailAddress,
    newPassword: Password,
    code: VerificationCodeCode
}