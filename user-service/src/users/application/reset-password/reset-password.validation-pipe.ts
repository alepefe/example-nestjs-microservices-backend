import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import InputValidator from '../../../shared/application/input-validator';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { ResetPasswordDTO } from '../../infrastructure/dtos/reset-password.dto';
import { ResetPasswordParams } from './reset-password.params';
import { VerificationCodeCode } from '../../domain/verification-code/verification-code-code.value-object';
import { Password } from '../../domain/auth-strategy/password.value-object';

@Injectable()
export class ResetPasswordValidationPipe implements PipeTransform {
  public transform(input: ResetPasswordDTO): ResetPasswordParams {
    const [errors, useCaseParams] = InputValidator.validateUseCaseParams<ResetPasswordParams>({
      email: { Class: EmailAddress, value: input.email },
      newPassword: { Class: Password, method: Password.fromString.name, value: input.newPassword },
      code: { Class: VerificationCodeCode, value: input.code }
    });

    if (errors.length > 0) throw new BadRequestException({ errors });
    return useCaseParams;
  }
}
