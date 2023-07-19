import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../users/domain/user.repository';
import { AuthenticateUserParams } from './authenticate-user.params';
import { UseCase } from '../../../shared/domain/use-case';
import { JWTProvider } from '../../infrastructure/jwt/jwt-provider';
import { Device, DeviceAttrs } from '../../domain/device';
import { UserId } from '../../../shared/domain/value-objects/user-id.value-object';
import { ObjectNotFoundError } from '../../../shared/domain/object-not-found.error';
import { DomainRequestContext } from '../../../shared/domain/request-context';
import { JWTPair } from '../../infrastructure/jwt/jwt-pair';
import { InvalidArgumentError } from '../../../shared/domain/invalid-argument.error';
import axios from 'axios';
import { Logger } from '../../../shared/domain/logger';
import { EmailVerified } from '../../domain/email-verified.value-object';
import { RegisterUserWithGoogleStrategyUseCase } from '../register-user/register-user-with-google-strategy.use-case';
import { Name } from '../../domain/name.value-object';
import { Surname } from '../../domain/surname.value-object';
import { AUTH_STRATEGIES } from '../../domain/auth-strategy/auth-strategies.constant';
import { EmailAddress } from '../../../shared/domain/value-objects/email-address.value-object';
import { AuthStrategyProviderId } from '../../domain/auth-strategy/auth-strategy-provider-id.value-object';

@Injectable()
export class AuthenticateUserWithGoogleIdTokenStrategyUseCase implements UseCase {
  constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
    private readonly registerUserWithGoogleStrategyUseCase: RegisterUserWithGoogleStrategyUseCase,
    private readonly jWTProvider: JWTProvider
  ) {}

  public async run(params: AuthenticateUserParams, ctx: DomainRequestContext): Promise<JWTPair> {
    if (params.idToken == null || params.idToken === '') {
      throw new InvalidArgumentError(`idToken expected for ${AUTH_STRATEGIES.GOOGLE_ID_TOKEN} strategy`);
    }

    let userData: { providerId: string, email: string, emailVerified: boolean, name: string, surname: string };
    try {
      const res = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${params.idToken}`, { timeout: 5000 });
      userData = {
        providerId: res.data.sub,
        email: res.data.email,
        emailVerified: Boolean(res.data.email_verified),
        name: res.data.given_name,
        surname: res.data.family_name
      };
    } catch (err: any) {
      this.logger.error(err, ctx);
      throw err;
    }

    const email = new EmailAddress(userData.email);
    try {
      const user = await this.userRepository.findUserByEmail(email);
      const userDevice = await this.findOrCreateUserDevice(user.id, ctx);
      const userDeviceAttrs = DeviceAttrs.fromPrimitives({ fcmToken: params.fcmToken });
      await this.updateUserDeviceIfRequired(userDevice, userDeviceAttrs);
      return await this.jWTProvider.generateTokenPair(user, userDevice);
    } catch (err: any) {
      if (err instanceof ObjectNotFoundError) {
        return await this.registerUserWithGoogleStrategyUseCase.run({
          authStrategy: params.authStrategy,
          providerId: new AuthStrategyProviderId(userData.providerId),
          email,
          emailVerified: new EmailVerified(userData.emailVerified),
          name: userData.name ? new Name(userData.name):undefined,
          surname: userData.surname ? new Surname(userData.surname): undefined,
          fcmToken: params.fcmToken
        }, ctx);
      }
      this.logger.error(err, ctx);
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
