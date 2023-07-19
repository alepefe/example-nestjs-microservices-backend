import { Body, Controller, HttpCode, Post, Req, UsePipes } from '@nestjs/common';
import { RequestWitDomainRequestContext } from '../../../shared/infrastructure/controllers/request-with-context';
import { Logger } from '../../../shared/domain/logger';
import { SendVerificationEmailValidationPipe } from '../../application/send-verification-email/send-verification-email.validation-pipe';
import { SendVerificationEmailParams } from '../../application/send-verification-email/send-verification-email.params';
import { SendVerificationEmailUseCase } from '../../application/send-verification-email/send-verification-email.use-case';

@Controller('/v1/users/send_verification_email')
export class SendVerificationEmailController {
  constructor(
    private readonly logger: Logger,
    private readonly sendVerificationEmailUseCase: SendVerificationEmailUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  @UsePipes(SendVerificationEmailValidationPipe)
  public async sendVerificationCode(
    @Req() req: RequestWitDomainRequestContext,
    @Body() params: SendVerificationEmailParams
  ) {
    const res = await this.sendVerificationEmailUseCase.run(params, req.domainRequestContext);
    return res;
  }
}
