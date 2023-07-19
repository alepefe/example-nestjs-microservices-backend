import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { VerificationCodeCode } from '../../domain/verification-code/verification-code-code.value-object';

export interface VerifyEmailParams {
    userId: UserId
    email: EmailAddress
    code: VerificationCodeCode
}