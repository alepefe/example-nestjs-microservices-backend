import { Injectable } from '@nestjs/common';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { UseCase } from '../../../shared/domain/use-case';
import { Active } from '../../../shared/domain/value-objects/active.value-object';
import { UserRole } from '../../../shared/domain/value-objects/user-role.value-object';
import { Device, DeviceAttrs } from '../../domain/device';
import { EmailVerified } from '../../domain/email-verified.value-object';
import { User } from '../../domain/user';
import { JWTProvider } from '../../infrastructure/jwt/jwt-provider';
import { RegisterUserParams } from './register-user.params';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { ObjectNotFoundError } from '../../../shared/domain/object-not-found.error';
import { Logger } from '../../../shared/domain/logger';
import { JWTPair } from '../../infrastructure/jwt/jwt-pair';
import { UserRepository } from '../../domain/user.repository';
import { Password } from '../../domain/auth-strategy/password.value-object';
import { EmailAlreadyExistsError } from '../../domain/email-already-exists.error';
import { AUTH_STRATEGIES } from '../../domain/auth-strategy/auth-strategies.constant';
import { AuthStrategyName } from '../../domain/auth-strategy/auth-strategy-name.value-object';
import { AuthStrategy } from '../../domain/auth-strategy/auth-strategy.value-object';

@Injectable()
export class RegisterUserWithLocalStrategyUseCase implements UseCase {
    constructor(
        private readonly logger: Logger,
        private readonly userRepository: UserRepository,
        private readonly jWTProvider: JWTProvider
    ) { }

    public async run(params: RegisterUserParams, ctx: DomainRequestContext): Promise<JWTPair> {
        if (params.email == null || params.password == null) {
            throw new InvalidArgumentError('email and password expected for local strategy');
        }

        try {
            await this.userRepository.findUserByEmail(params.email);
            throw new EmailAlreadyExistsError();
        } catch (err: any) {
            if (!(err instanceof ObjectNotFoundError)) throw err;
        }

        const userId = UserId.random();
        let user: User;
        let userDevice: Device;
        try {
            user = User.create({
                id: userId,
                active: new Active(true),
                emailVerified: new EmailVerified(false),
                email: params.email,
                name: params.name,
                surname: params.surname,
                authStrategies: [AuthStrategy.create({
                    name: new AuthStrategyName(AUTH_STRATEGIES.LOCAL),
                    active: new Active(true),
                    email: params.email,
                    userId: userId,
                    password: await Password.getHashedPassword(params.password.value)
                })],
                roles: [new UserRole('user')],
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
            return await this.jWTProvider.generateTokenPair(user, userDevice);
        } catch (err: any) {
            this.logger.error(err, ctx);
            try {
                await this.userRepository.deleteUser(user);
            } catch (innerError: any) {

            }
            try {
                await this.userRepository.deleteUserDevice(user.id, userDevice.deviceId);
            } catch (innerError: any) {

            }
            throw err;
        }
    }

}