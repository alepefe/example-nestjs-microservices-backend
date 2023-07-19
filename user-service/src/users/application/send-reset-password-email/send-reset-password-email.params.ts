import { EmailAddress } from 'src/shared/domain/value-objects/email-address.value-object';

export interface SendResetPasswordEmailParams {
  email: EmailAddress
}
