import { Injectable } from '@nestjs/common';
import { Logger } from '../../../shared/domain/logger';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { UseCase } from '../../../shared/domain/use-case';
import { UserRepository } from '../../domain/user.repository';
import { EmailSender } from '../../../shared/domain/email-sender';
import { AuthorizationError } from '../../../shared/domain/authorization.error';
import { VERIFICATION_CODE_TYPES } from '../../domain/verification-code/verification_code_types.constant';
import { VerificationCodeType } from '../../domain/verification-code/verification-code-type.value-object';
import { VerifyEmailParams } from './verify-email.params';
import { VerificationCodeExpiredError } from '../../domain/verification-code/verification-code-expired.error';
import { EmailVerified } from '../../domain/email-verified.value-object';
import { EmailAlreadyVerifiedError } from '../../domain/email-already-verified.error';

@Injectable()
export class VerifyEmailUseCase implements UseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly emailSender: EmailSender
  ) { }

  public async run(params: VerifyEmailParams, ctx: DomainRequestContext): Promise<void> {
    try {
      const type = new VerificationCodeType(VERIFICATION_CODE_TYPES.EMAIL);
      const user = await this.userRepository.findUserById(params.userId);
      if (user.email.value !== params.email.value) throw new AuthorizationError();
      if (user.emailVerified.value === true) throw new EmailAlreadyVerifiedError();
      
      const verificationCode = await this.userRepository.findVerificationCode(params.userId, type, params.code);
      if (verificationCode.isExpired()) {
        throw new VerificationCodeExpiredError();
      }

      user.update({
        emailVerified: new EmailVerified(true)
      });
      await this.userRepository.updateUser(user);
      await this.userRepository.deleteVerificationCodes(user.id, type);
    } catch (err: any) {
      this.logger.error(err, ctx);
      throw err;
    }
  }
}