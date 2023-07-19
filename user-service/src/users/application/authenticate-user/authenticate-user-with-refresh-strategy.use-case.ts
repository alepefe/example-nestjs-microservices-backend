import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../users/domain/user.repository';
import { AuthenticateUserParams } from './authenticate-user.params';
import { UseCase } from '../../../shared/domain/use-case';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import { AuthenticationError } from '../../../shared/domain/authentication.error';
import { Device, DeviceAttrs } from '../../domain/device';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { ObjectNotFoundError } from '../../../shared/domain/object-not-found.error';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { JWTProviderError } from '../../infrastructure/jwt/jwt-provider.error';
import { JWTProvider } from '../../infrastructure/jwt/jwt-provider';
import { JWTPair } from '../../infrastructure/jwt/jwt-pair';

@Injectable()
export class AuthenticateUserWithRefreshStrategyUseCase implements UseCase {
  constructor(private readonly userRepository: UserRepository, private readonly jWTProvider: JWTProvider) {}

  public async run(params: AuthenticateUserParams, ctx: DomainRequestContext): Promise<JWTPair> {
    if(ctx.auth.deviceId == null) throw new InvalidArgumentError('x-device-id header is required to create an account');

    try {
      const payload = await this.jWTProvider.verifyRefreshToken(params.refreshToken);
      const userId = new UserId(payload.sub);
      const securityUser = await this.userRepository.findUserById(userId);
      const userDevice = await this.findOrCreateUserDevice(userId, ctx);
      const userDeviceAttrs = DeviceAttrs.fromPrimitives({ fcmToken: params.fcmToken });
      await this.updateUserDeviceIfRequired(userDevice, userDeviceAttrs);
      return await this.jWTProvider.generateTokenPair(securityUser, userDevice);
    } catch (err: any) {
      if (err instanceof JWTProviderError) {
        throw new AuthenticationError();
      }
      throw err;
    }
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
