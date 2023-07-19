import { Controller, Get, Param, Query, Req, UsePipes } from '@nestjs/common';
import { FindUserUseCase } from '../../application/find-user/find-user.use-case';
import { FindUserValidationPipe } from '../../application/find-user/find-user.validation-pipe';
import { FindUserDTO } from '../dtos/find-user.dto';
import { FindUserParams } from '../../application/find-user/find-user.params';
import { RequestWitDomainRequestContext } from '../../../shared/infrastructure/controllers/request-with-context';
import { User } from '../../domain/user';

@Controller('/v1/users/:id')
export class FindUserController {
  constructor(
    private readonly findUserUseCase: FindUserUseCase
  ) {}

  @Get()
  @UsePipes(FindUserValidationPipe)
  public async findUser(
    @Req() req: RequestWitDomainRequestContext,
    @Param() params: FindUserParams
  ) {
    const user = await this.findUserUseCase.run(params, req.domainRequestContext);
    if(user instanceof User) {
      return user.toPrimitives();
    }

    return user;
  }
}
