import { Injectable } from '@nestjs/common';
import { AuthenticateUserParams } from './authenticate-user.params';
import { UseCase } from '../../../shared/domain/use-case';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { JWTPair } from '../../infrastructure/jwt/jwt-pair';
import { AuthenticateUserWithRefreshStrategyUseCase } from './authenticate-user-with-refresh-strategy.use-case';
import { AuthenticateUserWithLocalStrategyUseCase } from './authenticate-user-with-local-strategy.use-case';
import { AUTH_STRATEGIES } from '../../domain/auth-strategy/auth-strategies.constant';
import { AuthenticateUserWithGoogleIdTokenStrategyUseCase } from './authenticate-user-with-google-id-token-strategy.use-case';

@Injectable()
export class AuthenticateUserUseCase implements UseCase {
  constructor(
    private readonly authenticateUserWithRefreshStrategyUseCase: AuthenticateUserWithRefreshStrategyUseCase,
    private readonly authenticateUserWithLocalStrategyUseCase: AuthenticateUserWithLocalStrategyUseCase,
    private readonly authenticateUserWithGoogleIdTokenStrategyUseCase: AuthenticateUserWithGoogleIdTokenStrategyUseCase
  ) {}

  public async run(params: AuthenticateUserParams, ctx: DomainRequestContext): Promise<JWTPair> {
    if(ctx.auth.deviceId == null) throw new InvalidArgumentError('x-device-id header is required to create an account');

    switch(params.authStrategy.value){
      case AUTH_STRATEGIES.REFRESH_TOKEN:
        return await this.authenticateUserWithRefreshStrategyUseCase.run(params, ctx);

      case AUTH_STRATEGIES.LOCAL:
        return await this.authenticateUserWithLocalStrategyUseCase.run(params, ctx);

      case AUTH_STRATEGIES.GOOGLE_ID_TOKEN:
        return await this.authenticateUserWithGoogleIdTokenStrategyUseCase.run(params, ctx);

      default:
        throw new InvalidArgumentError('authStrategy not found');
    }
  }

}
