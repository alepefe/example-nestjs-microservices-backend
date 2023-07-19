import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import InputValidator from '../../../shared/application/input-validator';
import { ChangePasswordParams } from './change-password.params';
import { Password } from '../../domain/auth-strategy/password.value-object';
import { ChangePasswordDTO } from '../../infrastructure/dtos/change-password.dto';

@Injectable()
export class ChangePasswordValidationPipe implements PipeTransform {
  public transform(input: ChangePasswordDTO): ChangePasswordParams {
    const [errors, useCaseParams] = InputValidator.validateUseCaseParams<ChangePasswordParams>({
      userId: { Class: UserId, value: input.userId },
      oldPassword: { Class: Password, method: Password.fromString.name, value: input.oldPassword },
      password: { Class: Password, method: Password.fromString.name, value: input.password }
    });

    if (errors.length > 0) throw new BadRequestException({ errors });
    return useCaseParams;
  }
}
