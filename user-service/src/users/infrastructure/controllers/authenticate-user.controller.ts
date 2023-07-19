import { Body, Controller, HttpCode, Post, Req, UsePipes } from '@nestjs/common';
import { AuthenticateUserUseCase } from '../../application/authenticate-user/authenticate-user.use-case';
import { AuthenticateUserValidationPipe } from '../../application/authenticate-user/authenticate-user.validation-pipe';
import { RequestWitDomainRequestContext } from '../../../shared/infrastructure/controllers/request-with-context';
import { AuthenticateUserParams } from '../../application/authenticate-user/authenticate-user.params';
import { Logger } from '../../../shared/domain/logger';

@Controller('/v1/users/authenticate')
export class AuthenticateUserController {
  constructor(
    private readonly logger: Logger,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(AuthenticateUserValidationPipe)
  public async authenticate(
    @Req() req: RequestWitDomainRequestContext,
    @Body() params: AuthenticateUserParams
  ) {
    const res = await this.authenticateUserUseCase.run(params, req.domainRequestContext);
    return res;
  }
}
