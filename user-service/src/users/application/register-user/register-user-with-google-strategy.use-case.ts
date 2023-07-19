import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../shared/domain/use-case';
import { RegisterUserParams } from './register-user.params';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { JWTPair } from '../../infrastructure/jwt/jwt-pair';
import { JWTProvider } from '../../infrastructure/jwt/jwt-provider';
import { UserRepository } from '../../domain/user.repository';
import { Logger } from '../../../shared/domain/logger';
import { ObjectAlreadyExistsError } from '../../../shared/domain/object-already-exists.error';
import { ObjectNotFoundError } from '../../../shared/domain/object-not-found.error';
import { User } from '../../domain/user';
import { Device, DeviceAttrs } from '../../domain/device';
import { EmailVerified } from '../../domain/email-verified.value-object';
import { UserRole } from '../../../shared/domain/value-objects/user-role.value-object';
import { Active } from '../../../shared/domain/value-objects/active.value-object';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { AuthStrategy } from '../../domain/auth-strategy/auth-strategy.value-object';
import { AUTH_STRATEGIES } from '../../domain/auth-strategy/auth-strategies.constant';
import { AuthStrategyName } from '../../domain/auth-strategy/auth-strategy-name.value-object';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';

@Injectable()
export class RegisterUserWithGoogleStrategyUseCase implements UseCase {
    constructor(
        private readonly logger: Logger,
        private readonly userRepository: UserRepository,
        private readonly jWTProvider: JWTProvider
    ) { }

    public async run(params: RegisterUserParams, ctx: DomainRequestContext): Promise<JWTPair> {
        if (params.providerId == null) throw new InvalidArgumentError('no providerId provided ');
        
        try {
            await this.userRepository.findUserByEmail(params.email);
            throw new ObjectAlreadyExistsError();
        } catch (err: any) {
            if (!(err instanceof ObjectNotFoundError)) {
                throw err;
            }
        }

        const userId = UserId.random();
        let user: User;
        let userDevice: Device;
        try {
            user = User.create({
                id: userId,
                active: new Active(true),
                authStrategies: [AuthStrategy.create({
                    name: new AuthStrategyName(AUTH_STRATEGIES.GOOGLE_ID_TOKEN),
                    active: new Active(true),
                    email: params.email,
                    userId: userId,
                    providerId: params.providerId
                  })],
                emailVerified: params.emailVerified != null ? params.emailVerified : new EmailVerified(false),
                email: params.email,
                roles: [new UserRole('user')]
            });
            userDevice = Device.create({
                deviceId: ctx.auth.deviceId,
                userId: userId,
                name: ctx.request.userAgent,
                userAgent: ctx.request.userAgent,
                attrs: DeviceAttrs.fromPrimitives({ fcmToken: params.fcmToken })
            });
            await this.userRepository.createUser(user);
            await this.userRepository.createUserDevice(userDevice);
        } catch (err: any) {
            this.logger.error(err, ctx);
            if (err.response != null) {
                if (err.response.status === 409) {
                    throw new ObjectAlreadyExistsError(params.email.toString());
                }
            }
            throw err;
        }

        return await this.jWTProvider.generateTokenPair(user, userDevice);
    }

}