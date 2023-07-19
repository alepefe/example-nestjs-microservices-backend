import { JWK } from 'node-jose';
import * as jwt from 'jsonwebtoken';
import { Device } from 'src/users/domain/device';
import { User } from 'src/users/domain/user';
import { JWTPair } from './jwt-pair';
import { Injectable } from '@nestjs/common';
import { JWTProviderError } from './jwt-provider.error';

// HARDCODED TEST KEY
const PRIVATE_KEY = `
-----BEGIN PRIVATE KEY-----
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx
-----END PRIVATE KEY-----`;

@Injectable()
export class JWTProvider {
  private readonly keyStore: JWK.KeyStore;
  public keyStoreJSON: any;

  constructor() {
    this.keyStore = JWK.createKeyStore();
  }

  public async initialize(): Promise<void> {
    const key = await JWK.asKey(PRIVATE_KEY, 'pem');
    await this.keyStore.add(key);
    this.keyStoreJSON = this.keyStore.toJSON();
  }

  public async verifyRefreshToken(refreshToken: string): Promise<any> {
    const res = jwt.decode(refreshToken, { complete: true });
    if (res == null || res.header.kid == null) {
      throw new JWTProviderError('Cannot decode token');
    }

    const privateKey = this.keyStore.get(res.header.kid);
    if (privateKey == null) {
      throw new JWTProviderError('Cannot decode token');
    }
    return await new Promise<any>((resolve) => {
      jwt.verify(refreshToken, privateKey.toPEM(), (err: any, decoded: any) => {
        if (err != null) {
          throw err;
        }
        resolve(decoded);
      });
    });
  }

  public async generateTokenPair(user: User, device: Device): Promise<JWTPair> {
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60; // expires in 1 hour
    const accessTokenPayload = {
      iss: 'user-service',
      sub: user.id.toString(),
      authStrategies: user.authStrategies?.map(s => s.name.value).join(','),
      deviceId: device.deviceId.value,
      name: user.name?.value,
      surname: user.surname?.value,
      email: user.email.value,
      emailVerified: user.emailVerified.value,
      roles: user.roles.map((r) => r.value).join(','),
      iat: Math.floor(Date.now() / 1000), // issued at
      exp: expiresAt,
    };

    const refreshExpiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // expires in 30 days
    const refreshTokenPayload = {
      sub: user.id.toString(),
      iat: Math.floor(Date.now() / 1000), // issued at
      exp: refreshExpiresAt,
    };
    const accessToken = await new Promise<string>((resolve) => {
      jwt.sign(
        accessTokenPayload,
        PRIVATE_KEY,
        { algorithm: 'RS256', keyid: this.keyStore.all()[0].kid },
        (err: any, token: string | undefined) => {
          if (err != null) {
            throw err;
          }
          resolve(token as string);
        },
      );
    });
    const refreshToken = await new Promise<string>((resolve) => {
      jwt.sign(
        refreshTokenPayload,
        PRIVATE_KEY,
        { algorithm: 'RS256', keyid: this.keyStore.all()[0].kid },
        (err: any, token: string | undefined) => {
          if (err != null) {
            throw err;
          }
          resolve(token as string);
        },
      );
    });

    return {
      accessToken,
      refreshToken,
      expiresAt,
      refreshExpiresAt,
    };
  }
}
