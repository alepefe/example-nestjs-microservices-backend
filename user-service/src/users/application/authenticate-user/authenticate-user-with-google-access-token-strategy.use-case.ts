import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../users/domain/user.repository';
import { AuthenticateUserParams } from './authenticate-user.params';
import { UseCase } from '../../../shared/domain/use-case';
import { JWTProvider } from '../../infrastructure/jwt/jwt-provider';
import { Device, DeviceAttrs } from '../../domain/device';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { ObjectNotFoundError } from '../../../shared/domain/object-not-found.error';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { NotImplementedError } from '../../../shared/application/not-implemented.error';
import { JWTPair } from '../../infrastructure/jwt/jwt-pair';

@Injectable()
export class AuthenticateUserWithGoogleAccessTokenStrategyUseCase implements UseCase {
  constructor(private readonly userRepository: UserRepository, private readonly jWTProvider: JWTProvider) {}

  public async run(params: AuthenticateUserParams, ctx: DomainRequestContext): Promise<JWTPair> {
    throw new NotImplementedError();
  }

  private async findOrCreateUserDevice (userId: UserId, deviceAttrs: DeviceAttrs, ctx: DomainRequestContext): Promise<Device> {
    try {
      return await this.userRepository.findUserDevice(userId, ctx.auth.deviceId);
    } catch (err: any) {
      if (err instanceof ObjectNotFoundError) {
        const userDevice = Device.create({
          deviceId: ctx.auth.deviceId,
          userId,
          name: ctx.request.userAgent,
          userAgent: ctx.request.userAgent,
          attrs: deviceAttrs
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
