import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import InputValidator from '../../../shared/application/input-validator';
import { SendVerificationEmailParams } from './send-verification-email.params';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { SendVerificationEmailDTO } from '../../infrastructure/dtos/send-verification-email.dto';

@Injectable()
export class SendVerificationEmailValidationPipe implements PipeTransform {
  public transform(input: SendVerificationEmailDTO): SendVerificationEmailParams {
    const [errors, useCaseParams] = InputValidator.validateUseCaseParams<SendVerificationEmailParams>({
      userId: { Class: UserId, value: input.userId },
      email: { Class: EmailAddress, value: input.email }
    });

    if (errors.length > 0) throw new BadRequestException({ errors });
    return useCaseParams;
  }
}
