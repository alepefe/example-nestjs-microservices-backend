import { Body, Controller, HttpCode, Post, Req, UsePipes } from '@nestjs/common';
import { RequestWitDomainRequestContext } from '../../../shared/infrastructure/controllers/request-with-context';
import { Logger } from '../../../shared/domain/logger';
import { VerifyEmailUseCase } from '../../application/verify-email/verify-email.use-case';
import { VerifyEmailParams } from '../../application/verify-email/verify-email.params';
import { VerifyEmailValidationPipe } from '../../application/verify-email/verify-email.validation-pipe';

@Controller('/v1/users/verify_email')
export class VerifyEmailController {
  constructor(
    private readonly logger: Logger,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  @UsePipes(VerifyEmailValidationPipe)
  public async verifyEmail(
    @Req() req: RequestWitDomainRequestContext,
    @Body() params: VerifyEmailParams
  ) {
    const res = await this.verifyEmailUseCase.run(params, req.domainRequestContext);
    return res;
  }
}
