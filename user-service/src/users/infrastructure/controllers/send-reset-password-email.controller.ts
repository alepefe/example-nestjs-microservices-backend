import { Body, Controller, HttpCode, Post, Req, UsePipes } from '@nestjs/common';
import { RequestWitDomainRequestContext } from '../../../shared/infrastructure/controllers/request-with-context';
import { Logger } from '../../../shared/domain/logger';
import { SendResetPasswordEmailValidationPipe } from '../../application/send-reset-password-email/send-reset-password-email.validation-pipe';
import { SendResetPasswordEmailUseCase } from '../../application/send-reset-password-email/send-reset-password-email.use-case';
import { SendResetPasswordEmailParams } from '../../application/send-reset-password-email/send-reset-password-email.params';

@Controller('/v1/users/send_reset_password_email')
export class SendResetPasswordEmailController {
  constructor(
    private readonly logger: Logger,
    private readonly sendResetPasswordEmailUseCase: SendResetPasswordEmailUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  @UsePipes(SendResetPasswordEmailValidationPipe)
  public async verifyEmail(
    @Req() req: RequestWitDomainRequestContext,
    @Body() params: SendResetPasswordEmailParams
  ) {
    const res = await this.sendResetPasswordEmailUseCase.run(params, req.domainRequestContext);
    return res;
  }
}
