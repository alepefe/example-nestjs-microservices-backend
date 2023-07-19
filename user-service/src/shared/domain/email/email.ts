
import { EmailRecepients } from '../email-template/email-recepients';
import { EmailTemplate } from '../email-template/email-template';
import { AggregateRoot } from '../agreggate-root';
import { EmailAddress } from '../value-objects/email-address.value-object';
import { SentAt } from '../value-objects/sent-at.value-object';

export interface EmailPrimitives {
  from: string
  to: string
  subject: string
  body: string
  sentAt: Date
}

export interface EmailProps {
  from: EmailAddress
  to: EmailRecepients
  subject: string
  body: string
  sentAt: SentAt
}

export class Email extends AggregateRoot<EmailProps> {
  public get from (): EmailAddress { return this.props.from; }
  public get to (): EmailRecepients { return this.props.to; }
  public get subject (): string { return this.props.subject; }
  public get body (): string { return this.props.body; }
  public get sentAt (): SentAt { return this.props.sentAt; }

  public static fromTemplate (emailTemplate: EmailTemplate): Email {
    return new Email({
      from: emailTemplate.from,
      to: emailTemplate.to,
      subject: emailTemplate.subject,
      body: emailTemplate.body,
      sentAt: new SentAt()
    });
  }

  public fromPrimitives (): Email {
    throw new Error('not implemented');
  }

  public toPrimitives (): EmailPrimitives {
    return {
      from: this.props.from.value,
      to: this.props.to.value,
      subject: this.props.subject,
      body: this.props.body,
      sentAt: this.props.sentAt.value
    };
  }
}
