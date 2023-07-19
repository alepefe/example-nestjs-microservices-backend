import { Body, Controller, HttpCode, Post, Req, UsePipes } from '@nestjs/common';
import { RequestWitDomainRequestContext } from '../../../shared/infrastructure/controllers/request-with-context';
import { Logger } from '../../../shared/domain/logger';
import { ChangePasswordValidationPipe } from '../../application/change-password/change-password.validation-pipe';
import { ChangePasswordUseCase } from '../../application/change-password/change-password.use-case';
import { ChangePasswordParams } from '../../application/change-password/change-password.params';

@Controller('/v1/users/change_password')
export class ChangePasswordController {
  constructor(
    private readonly logger: Logger,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  @UsePipes(ChangePasswordValidationPipe)
  public async verifyEmail(
    @Req() req: RequestWitDomainRequestContext,
    @Body() params: ChangePasswordParams
  ) {
    const res = await this.changePasswordUseCase.run(params, req.domainRequestContext);
    return res;
  }
}
