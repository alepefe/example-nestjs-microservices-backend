import { AuthenticationError } from 'src/shared/domain/authentication.error';
import { Logger } from 'src/shared/domain/logger';
import { ObjectNotFoundError } from 'src/shared/domain/object-not-found.error';
import { UseCase } from 'src/shared/domain/use-case';
import { Password } from 'src/users/domain/auth-strategy/password.value-object';
import { UserRepository } from 'src/users/domain/user.repository';
import { VerificationCodeExpiredError } from 'src/users/domain/verification-code/verification-code-expired.error';
import { ResetPasswordParams } from './reset-password.params';
import { DomainRequestContext } from 'src/shared/domain/request-context';
import { AUTH_STRATEGIES } from 'src/users/domain/auth-strategy/auth-strategies.constant';
import { VerificationCodeType } from 'src/users/domain/verification-code/verification-code-type.value-object';
import { VERIFICATION_CODE_TYPES } from 'src/users/domain/verification-code/verification_code_types.constant';
import { TooManyPasswordResetAttemptsError } from 'src/users/domain/too-many-password-reset-attempts.error';
import { PasswordResetAttemptStore } from 'src/users/domain/password-reset-attempt-store';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { VerificationCode } from '../../domain/verification-code/verification-code';

@Injectable()
export class ResetPasswordUseCase implements UseCase {

    constructor (
      private readonly logger: Logger,
      private readonly userRepository: UserRepository,
      private readonly passwordResetAttemptStore: PasswordResetAttemptStore
    ) {}
  
    public async run (params: ResetPasswordParams, ctx: DomainRequestContext): Promise<void> {
      try {
        if (await this.passwordResetAttemptStore.hasExceededAttempts(params.email)) {
          await this.passwordResetAttemptStore.recordFailedAttempt(params.email);
          throw new TooManyPasswordResetAttemptsError();
        }
  
        const type = new VerificationCodeType(VERIFICATION_CODE_TYPES.RESET_PASSWORD);
        let user: User;
        try {
          user = await this.userRepository.findUserWithAuthStrategiesByEmail(params.email);
        } catch (err: any) {
          if (err instanceof ObjectNotFoundError) {
            await this.passwordResetAttemptStore.recordFailedAttempt(params.email);
          }
          throw err;
        }
  
        const localAuthStrategy = user.authStrategies?.find(s => s.name.value === AUTH_STRATEGIES.LOCAL);
        if (localAuthStrategy == null) {
          await this.passwordResetAttemptStore.recordFailedAttempt(params.email);
          throw new AuthenticationError('user does not support this auth strategy');
        }
  
        let verificationCode: VerificationCode;
        try {
          verificationCode = await this.userRepository.findVerificationCode(user.id, type, params.code);
        } catch (err: any) {
          if (err instanceof ObjectNotFoundError) {
            await this.passwordResetAttemptStore.recordFailedAttempt(params.email);
          }
          throw err;
        }
  
        if (verificationCode.isExpired()) {
          await this.passwordResetAttemptStore.recordFailedAttempt(params.email);
          throw new VerificationCodeExpiredError();
        }
  
        await this.userRepository.updateUserPassword(user.id, await Password.getHashedPassword(params.newPassword.toString()));
        await this.userRepository.deleteVerificationCodes(user.id, type);
      } catch (err: any) {
        this.logger.error(err, ctx);
        throw err;
      }
    }
  }