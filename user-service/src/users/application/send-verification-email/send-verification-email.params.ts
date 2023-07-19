import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';

export interface SendVerificationEmailParams {
    userId: UserId
    email: EmailAddress
}