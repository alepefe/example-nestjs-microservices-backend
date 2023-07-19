import { Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { EmailSender } from '../../../shared/domain/email-sender';
import { SMTPConfig } from '../../../shared/infrastructure/smtp/smtp-config';
import { EmailNotSentError } from '../../../shared/infrastructure/smtp/email-not-send.error';
import { Email } from '../../../shared/domain/email/email';

@Injectable()
export default class UserNodeEmailSender implements EmailSender {
  private readonly transporter: Transporter;

  constructor(
    @Inject('USER_SMTP_CONFIG')
    smtpConfig: SMTPConfig
  ) {
    this.transporter = createTransport(
      {
        host: smtpConfig.host,
        secure: true,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.password,
          method: 'LOGIN'
        }
      }
    );
  }

  async send(email: Email): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: email.from.toString(),
        to: email.to.toString(),
        subject: email.subject.toString(),
        html: email.body.toString()
      });
    } catch (err) {
      console.log(err);
      throw new EmailNotSentError();
    }
  }
}
