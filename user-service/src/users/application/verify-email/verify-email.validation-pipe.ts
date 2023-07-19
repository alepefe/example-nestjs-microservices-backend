import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import InputValidator from '../../../shared/application/input-validator';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { VerifyEmailParams } from './verify-email.params';
import { VerificationCodeCode } from '../../domain/verification-code/verification-code-code.value-object';
import { VerifyEmailDTO } from '../../infrastructure/dtos/verify-email.dto';

@Injectable()
export class VerifyEmailValidationPipe implements PipeTransform {
  public transform(input: VerifyEmailDTO): VerifyEmailParams {
    const [errors, useCaseParams] = InputValidator.validateUseCaseParams<VerifyEmailParams>({
      userId: { Class: UserId, value: input.userId },
      email: { Class: EmailAddress, value: input.email },
      code: { Class: VerificationCodeCode, value: input.code }
    });

    if (errors.length > 0) throw new BadRequestException({ errors });
    return useCaseParams;
  }
}
