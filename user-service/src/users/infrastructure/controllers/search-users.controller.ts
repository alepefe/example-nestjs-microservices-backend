import { Controller, Get, Req } from '@nestjs/common';
import { RequestWitDomainRequestContext } from '../../../shared/infrastructure/controllers/request-with-context';
import { Logger } from '../../../shared/domain/logger';
import { NotImplementedError } from '../../../shared/application/not-implemented.error';

@Controller('/v1/users')
export class SearchUsersController {
  constructor(
    private readonly logger: Logger
  ) {}

  @Get()
  public searchUsers(
    @Req() req: RequestWitDomainRequestContext,
  ) {
    throw new NotImplementedError('Not implemented.');
  }
}
