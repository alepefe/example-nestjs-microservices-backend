import { Body, Controller, HttpCode, Post, Req, UsePipes } from '@nestjs/common';
import { RequestWitDomainRequestContext } from '../../../shared/infrastructure/controllers/request-with-context';
import { Logger } from '../../../shared/domain/logger';
import { ResetPasswordUseCase } from '../../application/reset-password/reset-password.use-case';
import { ResetPasswordParams } from '../../application/reset-password/reset-password.params';
import { ResetPasswordValidationPipe } from '../../application/reset-password/reset-password.validation-pipe';

@Controller('/v1/users/reset_password')
export class ResetPasswordController {
  constructor(
    private readonly logger: Logger,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  @UsePipes(ResetPasswordValidationPipe)
  public async verifyEmail(
    @Req() req: RequestWitDomainRequestContext,
    @Body() params: ResetPasswordParams
  ) {
    const res = await this.resetPasswordUseCase.run(params, req.domainRequestContext);
    return res;
  }
}
