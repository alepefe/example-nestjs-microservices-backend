import { Controller, Get } from '@nestjs/common';
import { JWTProvider } from '../jwt/jwt-provider';

@Controller('/jwks')
export class JWKSController {
  constructor(
    private readonly jWTProvider: JWTProvider
  ) {}

  @Get()
  public async jwks () {
    return await this.jWTProvider.keyStoreJSON;
  }
}
