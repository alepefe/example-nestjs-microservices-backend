import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { FindUserDTO } from '../../infrastructure/dtos/find-user.dto';
import { FindUserParams } from './find-user.params';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import InputValidator from '../../../shared/application/input-validator';

@Injectable()
export class FindUserValidationPipe implements PipeTransform {
  public transform(input: FindUserDTO): FindUserParams {
    const [errors, useCaseParams] = InputValidator.validateUseCaseParams<FindUserParams>({
      userId: { Class: UserId, value: input.id },
    });

    if (errors.length > 0) throw new BadRequestException({ errors });
    return useCaseParams;
  }
}
