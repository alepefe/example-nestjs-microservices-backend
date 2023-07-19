import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import InputValidator from '../../../shared/application/input-validator';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { SendResetPasswordEmailParams } from './send-reset-password-email.params';
import { SendResetPasswordEmailDTO } from '../../infrastructure/dtos/send-reset-password-email.dto';

@Injectable()
export class SendResetPasswordEmailValidationPipe implements PipeTransform {
  public transform(input: SendResetPasswordEmailDTO): SendResetPasswordEmailParams {
    const [errors, useCaseParams] = InputValidator.validateUseCaseParams<SendResetPasswordEmailParams>({
      email: { Class: EmailAddress, value: input.email }
    });

    if (errors.length > 0) throw new BadRequestException({ errors });
    return useCaseParams;
  }
}
