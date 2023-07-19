import { Email } from './email/email';

export interface IEmailSender {
  send(email: Email): Promise<void>
}


export abstract class EmailSender implements IEmailSender {
  public async send(email: Email): Promise<void> {
    throw new Error('Method not implemented.');
  }

}