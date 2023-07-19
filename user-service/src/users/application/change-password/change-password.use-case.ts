import { Injectable } from '@nestjs/common';
import { AuthorizationError } from '../../../shared/domain/authorization.error';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { UseCase } from '../../../shared/domain/use-case';
import { AUTH_STRATEGIES } from '../../domain/auth-strategy/auth-strategies.constant';
import { Password } from '../../domain/auth-strategy/password.value-object';
import { UserRepository } from '../../domain/user.repository';
import { ChangePasswordParams } from './change-password.params';
import { Logger } from '../../../shared/domain/logger';


@Injectable()
export class ChangePasswordUseCase implements UseCase {
    constructor(
        private readonly logger: Logger,
        private readonly userRepository: UserRepository,
    ) { }

    public async run(params: ChangePasswordParams, ctx: DomainRequestContext): Promise<void> {
        if (!this.canDeleteUser(params, ctx)) throw new AuthorizationError();

        try {
            const user = await this.userRepository.findUserWithAuthStrategiesById(params.userId);
            const localAuthStrategy = user.authStrategies?.find(s => s.name.value === AUTH_STRATEGIES.LOCAL);
            if (localAuthStrategy == null) throw new InvalidArgumentError('user does not support this auth strategy');

            if (localAuthStrategy.password == null || !await localAuthStrategy.password.verify(params.oldPassword)) {
                throw new AuthorizationError();
            }

            await this.userRepository.updateUserPassword(user.id, await Password.getHashedPassword(params.password.value));
        } catch (err: any) {
            this.logger.error(err);
            throw err;
        }
    }

    private canDeleteUser(params: ChangePasswordParams, ctx: DomainRequestContext): boolean {
        if (ctx.auth.authenticatedUserId != null && params.userId.equals(ctx.auth.authenticatedUserId)) return true;
        return false;
    }
}