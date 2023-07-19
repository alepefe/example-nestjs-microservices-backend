
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import InputValidator from '../../../shared/application/input-validator';
import { AUTH_STRATEGIES } from '../../domain/auth-strategy/auth-strategies.constant';
import { Password } from '../../domain/auth-strategy/password.value-object';
import { RegisterUserDTO } from '../../infrastructure/dtos/register-user.dto';
import { RegisterUserParams } from './register-user.params';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { AuthStrategyName } from '../../domain/auth-strategy/auth-strategy-name.value-object';
import { Name } from '../../domain/name.value-object';
import { Surname } from '../../domain/surname.value-object';

@Injectable()
export class RegisterUserValidationPipe implements PipeTransform {
  public transform(input: RegisterUserDTO): RegisterUserParams {
    if (input.authStrategy === AUTH_STRATEGIES.LOCAL) {
      const [errors, useCaseParams] =
        InputValidator.validateUseCaseParams<RegisterUserParams>({
          authStrategy: { Class: AuthStrategyName, value: input.authStrategy },
          name: input.name ? { Class: Name, value: input.name }: undefined,
          surname: input.surname ? { Class: Surname, value: input.surname }: undefined,
          email: { Class: EmailAddress, value: input.email },
          password: { Class: Password, method: Password.fromString.name, value: input.password },
          fcmToken: input.fcmToken ? { value: input.fcmToken } : undefined
        });
      if (errors.length > 0) throw new BadRequestException({ errors });
      return useCaseParams;

    } else if (input.authStrategy === AUTH_STRATEGIES.GOOGLE_ID_TOKEN || input.authStrategy === AUTH_STRATEGIES.GOOGLE_ACCESS_TOKEN ) {
      const [errors, useCaseParams] =
        InputValidator.validateUseCaseParams<RegisterUserParams>({
          authStrategy: { Class: AuthStrategyName, value: input.authStrategy },
          idToken: { value: input.idToken },
          fcmToken: input.fcmToken ? { value: input.fcmToken } : undefined
        });
      if (errors.length > 0) throw new BadRequestException({ errors });
      return useCaseParams;
    }
    throw new BadRequestException({
      errors: [
        {
          name: 'InvalidArgumentError',
          message: `invalid authStrategy`,
          key: 'authStrategy',
        },
      ],
    });
  }
}
