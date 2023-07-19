import { Email } from 'src/shared/domain/email/email';
import { EmailRecepients } from 'src/shared/domain/email-template/email-recepients';
import { USER_ROLES } from 'src/shared/domain/constants/user-roles.constant';
import { EmailSender } from 'src/shared/domain/email-sender';
import { Logger } from 'src/shared/domain/logger';
import { DomainRequestContext } from 'src/shared/domain/request-context';
import { UseCase } from 'src/shared/domain/use-case';
import { EmailAddress } from 'src/shared/domain/value-objects/email-address.value-object';
import { ExpiresAt } from 'src/shared/domain/value-objects/expires-at.value-object';
import { UserRepository } from 'src/users/domain/user.repository';
import { TooManyVerificationCodesSentError } from 'src/users/domain/verification-code/too-many-verification-codes-sent.error';
import { VerificationCode } from 'src/users/domain/verification-code/verification-code';
import { VerificationCodeType } from 'src/users/domain/verification-code/verification-code-type.value-object';
import { VERIFICATION_CODE_TYPES } from 'src/users/domain/verification-code/verification_code_types.constant';
import { SendResetPasswordEmailParams } from './send-reset-password-email.params';
import { Injectable } from '@nestjs/common';
import { AuthenticationError } from 'src/shared/domain/authentication.error';
import { AUTH_STRATEGIES } from 'src/users/domain/auth-strategy/auth-strategies.constant';
import ResetPasswordEmailTemplate from '../../domain/email-template/reset-password.email-template';

@Injectable()
export class SendResetPasswordEmailUseCase implements UseCase {

  constructor (
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly emailSender: EmailSender
  ) {}

  public async run (params: SendResetPasswordEmailParams, ctx: DomainRequestContext): Promise<void> {
    try {
      const user = await this.userRepository.findUserWithAuthStrategiesByEmail(params.email);
      const localAuthStrategy = user.authStrategies?.find(s => s.name.value === AUTH_STRATEGIES.LOCAL);
      if (localAuthStrategy == null) {
        throw new AuthenticationError('user does not support this auth strategy');
      }

      const type = new VerificationCodeType(VERIFICATION_CODE_TYPES.RESET_PASSWORD);
      const verificationCodes = await this.userRepository.verificationCodesSentInLastInterval(user.id, type, '24 hours');
      if (!ctx.auth.authenticatedUserRoles?.includes(USER_ROLES.ADMIN) && verificationCodes.length > 99) throw new TooManyVerificationCodesSentError();

      const verificationCode = VerificationCode.createRandom({
        userId: user.id,
        type,
        expiresAt: new ExpiresAt(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)) // 24 hours from now
      });

      const from = new EmailAddress(process.env.SENDER_EMAIL);
      const to = new EmailRecepients(user.email.value);
      const emailTemplate = ResetPasswordEmailTemplate.factory({ from, to, code: verificationCode.code });
      const email = Email.fromTemplate(emailTemplate);

      await this.emailSender.send(email);
      await this.userRepository.createVerificationCode(verificationCode);
    } catch (err: any) {
      this.logger.error(err);
      throw err;
    }
  }
}
