import { Injectable } from '@nestjs/common';
import ObjectUtils from '../../../shared/application/object.utils';
import { AuthorizationError } from '../../../shared/domain/authorization.error';
import { USER_ROLES } from '../../../shared/domain/constants/user-roles.constant';
import { Logger } from '../../../shared/domain/logger';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { UseCase } from '../../../shared/domain/use-case';
import { User, UserPrimitives } from '../../domain/user';
import { UserRepository } from '../../domain/user.repository';
import { FindUserParams } from './find-user.params';

@Injectable()
export class FindUserUseCase implements UseCase {
    constructor(
        private readonly logger: Logger,
        private readonly userRepository: UserRepository
    ) { }

    public async run(params: FindUserParams, ctx: DomainRequestContext): Promise<Partial<User> | Partial<UserPrimitives>> {
        if (!this.canFindUser(params, ctx)) throw new AuthorizationError();

        try {
            const user = await this.userRepository.findUserPrimitivesById(params.userId);
            if (this.shouldFilterFields(params, ctx)) {
                return ObjectUtils.filterProperties<UserPrimitives>(user, User.SENSITIVE_FIELDS);
            }
            return ObjectUtils.filterProperties<UserPrimitives>(user, User.MUST_REMOVE_FIELDS);
        } catch (err: any) {
            this.logger.error(err, ctx);
        }
    }

    private canFindUser(params: FindUserParams, ctx: DomainRequestContext): boolean {
        if (ctx.auth.authenticatedUserId == null) return false;
        return true;
    }

    private shouldFilterFields(params: FindUserParams, ctx: DomainRequestContext): boolean {
        if (params.userId.toString() === ctx.auth.authenticatedUserId?.toString()) return false;
        if (ctx.auth.authenticatedUserRoles.includes(USER_ROLES.ADMIN)) return false;
        return true;
    }
}