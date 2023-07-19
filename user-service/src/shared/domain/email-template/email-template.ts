
import { EmailAddress } from '../value-objects/email-address.value-object';
import { EmailRecepients } from './email-recepients';

export interface EmailTemplate {
  readonly templateName: string
  readonly from: EmailAddress
  readonly to: EmailRecepients
  readonly subject: string
  readonly body: string
}
