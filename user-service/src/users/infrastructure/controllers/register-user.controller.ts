import { Body, Controller, HttpCode, Post, Req, UsePipes } from '@nestjs/common';
import { RequestWitDomainRequestContext } from '../../../shared/infrastructure/controllers/request-with-context';
import { RegisterUserValidationPipe } from '../../application/register-user/register-user.validation-pipe';
import { RegisterUserUseCase } from '../../application/register-user/register-user.use-case';
import { RegisterUserParams } from '../../application/register-user/register-user.params';
import { Logger } from '../../../shared/domain/logger';

@Controller('/v1/users/register')
export class RegisterUserController {
  constructor(
    private readonly logger: Logger,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(RegisterUserValidationPipe)
  public async register(
    @Req() req: RequestWitDomainRequestContext,
    @Body() params: RegisterUserParams
  ) {
    const res = await this.registerUserUseCase.run(params, req.domainRequestContext);
    return res;
  }
}
