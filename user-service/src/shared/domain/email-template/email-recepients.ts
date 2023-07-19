import { EmailAddress } from '../value-objects/email-address.value-object';
import { StringValueObject } from '../value-objects/string.value-object';

export class EmailRecepients extends StringValueObject {
  constructor(value: string) {
    EmailRecepients.ensureEmailRecepientsIsValid(value);
    super(value);
  }

  static ensureEmailRecepientsIsValid(emailRecepients: string): void {
    emailRecepients.split(',').forEach((recipient) => new EmailAddress(recipient));
  }
}
