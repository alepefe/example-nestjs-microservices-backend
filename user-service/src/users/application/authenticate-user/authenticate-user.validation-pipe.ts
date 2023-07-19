import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import InputValidator from '../../../shared/application/input-validator';
import { AuthenticateUserDTO } from '../../infrastructure/dtos/authenticate-user.dto';
import { AuthenticateUserParams } from './authenticate-user.params';
import { AUTH_STRATEGIES } from '../../domain/auth-strategy/auth-strategies.constant';
import { AuthStrategyName } from '../../domain/auth-strategy/auth-strategy-name.value-object';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { Password } from '../../domain/auth-strategy/password.value-object';

@Injectable()
export class AuthenticateUserValidationPipe implements PipeTransform {
  public transform(input: AuthenticateUserDTO): AuthenticateUserParams {
    if (input.authStrategy === AUTH_STRATEGIES.REFRESH_TOKEN) {
      if (input.refreshToken == null) {
        throw new BadRequestException({
          errors: [
            {
              name: 'InvalidArgumentError',
              message: `refreshToken expected for ${AUTH_STRATEGIES.REFRESH_TOKEN} strategy`,
              key: 'refreshToken',
            },
          ],
        });
      }

      const [errors, useCaseParams] = InputValidator.validateUseCaseParams<AuthenticateUserParams>({
          authStrategy: { Class: AuthStrategyName, value: input.authStrategy },
          refreshToken: { value: input.refreshToken },
          fcmToken: input.fcmToken ? { value: input.fcmToken } : undefined
        });
      if (errors.length > 0) throw new BadRequestException({ errors });

      return useCaseParams;
    } else if (input.authStrategy === AUTH_STRATEGIES.LOCAL) {
      if (input.email == null || input.password == null) {
        throw new BadRequestException({
          errors: [
            {
              name: 'InvalidArgumentError',
              message: `email expected for ${AUTH_STRATEGIES.LOCAL} strategy`,
              key: 'email',
            },
            {
              name: 'InvalidArgumentError',
              message: `password expected for ${AUTH_STRATEGIES.LOCAL} strategy`,
              key: 'password',
            },
          ],
        });
      }

      const [errors, useCaseParams] = InputValidator.validateUseCaseParams<AuthenticateUserParams>({
          authStrategy: { Class: AuthStrategyName, value: input.authStrategy },
          email: { Class: EmailAddress, value: input.email },
          password: { Class: Password, value: input.password },
          fcmToken: input.fcmToken ? { value: input.fcmToken } : undefined
        });
      if (errors.length > 0) throw new BadRequestException({ errors });

      return useCaseParams;
    } else if (input.authStrategy === AUTH_STRATEGIES.GOOGLE_ID_TOKEN) {
      if (input.idToken == null) {
        throw new BadRequestException({
          errors: [
            {
              name: 'InvalidArgumentError',
              message: `idToken expected for ${AUTH_STRATEGIES.GOOGLE_ID_TOKEN} strategy`,
              key: 'idToken',
            },
          ],
        });
      }

      const [errors, useCaseParams] = InputValidator.validateUseCaseParams<AuthenticateUserParams>({
          authStrategy: { Class: AuthStrategyName, value: input.authStrategy },
          idToken: { value: input.idToken },
          fcmToken: input.fcmToken ? { value: input.fcmToken } : undefined
        });
      if (errors.length > 0) throw new BadRequestException({ errors });

      return { ...useCaseParams };
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
