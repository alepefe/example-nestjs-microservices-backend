import { EmailAddress } from 'src/shared/domain/value-objects/email-address.value-object';

export interface IPasswordResetAttemptStore {
  recordFailedAttempt(email: EmailAddress): Promise<void>
  hasExceededAttempts(email: EmailAddress): Promise<boolean>
}

export class PasswordResetAttemptStore implements IPasswordResetAttemptStore {
  recordFailedAttempt(email: EmailAddress): Promise<void> {
    throw new Error('Method not implemented.');
  }
  hasExceededAttempts(email: EmailAddress): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
