import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../users/domain/user.repository';
import { AuthenticateUserParams } from './authenticate-user.params';
import { UseCase } from '../../../shared/domain/use-case';
import { JWTProvider } from '../../infrastructure/jwt/jwt-provider';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { AuthenticationError } from '../../../shared/domain/authentication.error';
import { Device, DeviceAttrs } from '../../domain/device';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { ObjectNotFoundError } from '../../../shared/domain/object-not-found.error';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { JWTPair } from '../../infrastructure/jwt/jwt-pair';
import { AUTH_STRATEGIES } from '../../domain/auth-strategy/auth-strategies.constant';
import { LoginAttemptStore } from 'src/users/domain/login-attempt-store';
import { TooManyLoginAttemptsError } from 'src/users/domain/too-many-login-attemtps.error';
import { User } from 'src/users/domain/user';

@Injectable()
export class AuthenticateUserWithLocalStrategyUseCase implements UseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jWTProvider: JWTProvider,
    private readonly loginAttemptStore: LoginAttemptStore
  ) {}

  public async run(params: AuthenticateUserParams, ctx: DomainRequestContext): Promise<JWTPair> {
    if (params.email == null || params.password == null) {
      throw new InvalidArgumentError('email and password expected for local strategy');
    }

    if (await this.loginAttemptStore.hasExceededAttempts(params.email)) {
      await this.loginAttemptStore.recordFailedAttempt(params.email);
      throw new TooManyLoginAttemptsError();
    }

    let user: User;
    try {
      user = await this.userRepository.findUserWithAuthStrategiesByEmail(params.email);
    } catch (err: any) {
      if (err instanceof ObjectNotFoundError) {
        await this.loginAttemptStore.recordFailedAttempt(params.email);
      }
      throw err;
    }

    const localAuthStrategy = user.authStrategies?.find(s => s.name.value === AUTH_STRATEGIES.LOCAL);
    if (localAuthStrategy == null) {
      await this.loginAttemptStore.recordFailedAttempt(params.email);
      throw new AuthenticationError('user does not support this auth strategy');
    }

    if (localAuthStrategy.password == null || !await localAuthStrategy.password.verify(params.password)) {
      await this.loginAttemptStore.recordFailedAttempt(params.email);
      throw new AuthenticationError();
    }

    const userDevice = await this.findOrCreateUserDevice(user.id, ctx);
    const userDeviceAttrs = DeviceAttrs.fromPrimitives({ fcmToken: params.fcmToken });
    await this.updateUserDeviceIfRequired(userDevice, userDeviceAttrs);
    // Rate limit
    await this.loginAttemptStore.recordFailedAttempt(params.email);
    return await this.jWTProvider.generateTokenPair(user, userDevice);
  }

  private async findOrCreateUserDevice (userId: UserId, ctx: DomainRequestContext): Promise<Device> {
    try {
      return await this.userRepository.findUserDevice(userId, ctx.auth.deviceId);
    } catch (err: any) {
      if (err instanceof ObjectNotFoundError) {
        const userDevice = Device.create({
          deviceId: ctx.auth.deviceId,
          userId,
          name: ctx.request.userAgent,
          userAgent: ctx.request.userAgent
        });
        await this.userRepository.createUserDevice(userDevice);
        return userDevice;
      }
      throw err;
    }
  }

  private async updateUserDeviceIfRequired (userDevice: Device, attrs: DeviceAttrs): Promise<Device> {
    const currentAttrsStr = JSON.stringify(userDevice.attrs?.toPrimitives());
    const newAttrsStr = JSON.stringify(attrs?.toPrimitives());
    if (currentAttrsStr === newAttrsStr) {
      return userDevice;
    }

    userDevice.updateAttrs(attrs);
    await this.userRepository.updateUserDevice(userDevice);
    return userDevice;
  }

}
