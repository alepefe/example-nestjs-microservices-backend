import { Injectable } from '@nestjs/common';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { RegisterUserParams } from './register-user.params';
import { RegisterUserWithLocalStrategyUseCase } from './register-user-with-local-strategy.use-case';
import { UseCase } from '../../../shared/domain/use-case';
import { JWTPair } from '../../infrastructure/jwt/jwt-pair';
import { RegisterUserWithGoogleStrategyUseCase } from './register-user-with-google-strategy.use-case';
import { AUTH_STRATEGIES } from '../../domain/auth-strategy/auth-strategies.constant';

@Injectable()
export class RegisterUserUseCase implements UseCase {
    constructor(
        private readonly registerUserWithLocalStrategyUseCase: RegisterUserWithLocalStrategyUseCase,
        private readonly registerUserWithGoogleStrategyUseCase: RegisterUserWithGoogleStrategyUseCase
    ) {}

    public async run(params: RegisterUserParams, ctx: DomainRequestContext): Promise<JWTPair> {
        if(ctx.auth.deviceId == null) throw new InvalidArgumentError('x-device-id header is required to create an account');

        switch(params.authStrategy.value){      
            case AUTH_STRATEGIES.LOCAL:
              return await this.registerUserWithLocalStrategyUseCase.run(params, ctx);
      
            case AUTH_STRATEGIES.GOOGLE_ID_TOKEN:
                return await this.registerUserWithGoogleStrategyUseCase.run(params, ctx);

            case AUTH_STRATEGIES.GOOGLE_ACCESS_TOKEN:
                return await this.registerUserWithGoogleStrategyUseCase.run(params, ctx);

            default:
              throw new InvalidArgumentError('authStrategy not found');
          }
    }
}